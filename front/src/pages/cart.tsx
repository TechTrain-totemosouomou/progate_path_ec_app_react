import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Loading} from "../components/loading";
import {Product} from "../types";
import {useCart} from "../context/CartContext";
import {convertToLocalTime} from "../hooks/useProductSearch";
import ProductList from "../components/ProductList";

export function CartPage(): JSX.Element {
  const {cart, clearCart} = useCart();
  const cartProductIds = Object.keys(cart).map(Number);

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?productIds=${cartProductIds.join(",")}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();

        const productsWithLocalTime: Product[] = data.map(
          (product: Product) => ({
            ...product,
            lastOrderedAt: convertToLocalTime(product.lastOrderedAt),
          }),
        );

        setProducts(productsWithLocalTime);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const {updateCart} = useCart();

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateCart(productId, quantity);
  };

  const handleOrder = async () => {
    try {
      const orderItems = Object.keys(cart).map(productId => ({
        productId: Number(productId),
        quantity: cart[Number(productId)],
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderItems),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          const errorMessages = errorData.errors
            ? errorData.errors.join(", ")
            : "cart page validation error";
          setErrorMessage(errorMessages);
        } else {
          setErrorMessage("Unexpected error occurred");
        }
        return;
      }

      const data = await response.json();
      clearCart();
      navigate(`/orders/${data.orderId}/complete`);
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Unexpected error occurred");
    }
  };

  // カート内商品の数量の合計を計算する
  const totalQuantity = Object.values(cart).reduce((acc, qty) => acc + qty, 0);

  // カート内商品の総額を計算する
  const totalPrice = products.reduce(
    (acc, product) => acc + (cart[product.id] || 0) * product.price,
    0,
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1>Cart</h1>
          <div data-test="cart-summary">
            <p data-test="total-price">Total price: {totalPrice} coins</p>
            <p data-test="total-quantity">Total quantity: {totalQuantity}</p>
          </div>
          <div>
            <ProductList
              products={products}
              cart={cart}
              onQuantityChange={handleQuantityChange}
              emptyMessage={<p data-test="cart-empty-message">Cart is empty</p>}
            />

            {products.length > 0 && (
              <div>
                {errorMessage && (
                  <p data-test="error-message" style={{color: "red"}}>
                    {errorMessage}
                  </p>
                )}
                <button data-test="order-button" onClick={handleOrder}>
                  Order
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
