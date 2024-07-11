import {Product} from "../types";

interface ProductListProps {
  products: Product[];
  cart: Record<number, number>;
  onQuantityChange: (productId: number, quantity: number) => void;
  emptyMessage?: React.ReactNode; // JSX 要素全体を受け取る
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  cart,
  onQuantityChange,
  emptyMessage = <p>No products found.</p>, // デフォルトの空メッセージ
}) => {
  return (
    <div data-test="product-list">
      {products.length > 0 ? (
        products.map((product: Product) => (
          <div key={product.id} data-test={`product-item-${product.id}`}>
            <img
              data-test="product-image"
              src={`/image/${product.imageName}`}
              alt={product.name}
            />
            <div>
              <p data-test="product-last-ordered-at">
                last order: {product.lastOrderedAt}
              </p>
              <h2 data-test="product-name">{product.name}</h2>
              <p data-test="product-price">Price: ${product.price}</p>
              <input
                type="number"
                min="0"
                data-test="product-quantity-input"
                max={product.quantity}
                defaultValue={cart[product.id] || 0}
                disabled={product.quantity === 0}
                onChange={e =>
                  onQuantityChange(product.id, Number(e.target.value))
                }
              />
              <p data-test="product-stock-quantity">
                Stock: {product.quantity}
              </p>
            </div>
          </div>
        ))
      ) : (
        <>{emptyMessage}</>
      )}
    </div>
  );
};

export default ProductList;
