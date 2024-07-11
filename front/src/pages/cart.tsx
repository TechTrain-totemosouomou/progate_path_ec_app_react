import {useEffect, useState} from "react";
import {Loading} from "../components/loading";
import {Product} from "../types";
import {useCart} from "../context/CartContext";
import {convertToLocalTime} from "../hooks/useProductSearch";
import ProductList from "../components/ProductList";

export function CartPage(): JSX.Element {
  const {cart} = useCart();
  const cartProductIds = Object.keys(cart).map(Number);

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

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

  // カート内商品の数量の合計を計算する
  const totalQuantity = Object.values(cart).reduce((acc, qty) => acc + qty, 0);

  // カート内商品の総額を計算する
  const totalPrice = products.reduce(
    (acc, product) => acc + (cart[product.id] || 0) * product.price,
    0,
  );

  return (
    <div>
      <h1>Cart</h1>
      <div data-test="cart-summary">
        <p data-test="total-price">Total price: {totalPrice} coins</p>
        <p data-test="total-quantity">Total quantity: {totalQuantity}</p>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <ProductList
          products={products}
          cart={cart}
          onQuantityChange={handleQuantityChange}
          emptyMessage={<p data-test="cart-empty-message">Cart is empty</p>} // JSX 要素全体を指定
        />
      )}
    </div>
  );
}
