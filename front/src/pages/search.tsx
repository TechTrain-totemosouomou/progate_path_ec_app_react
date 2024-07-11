import {Loading} from "../components/loading";
import SearchForm from "../components/SearchForm";
import useProductSearch from "../hooks/useProductSearch";
import {Product} from "../types";

export function SearchPage(): JSX.Element {
  const {
    products,
    hitCount,
    currentPage,
    loading,
    setSearchParams,
    handlePageChange,
    itemsPerPage,
  } = useProductSearch();

  const filteredProducts = products;

  return (
    <div>
      <SearchForm onSearch={filter => setSearchParams({filter})} />

      {loading ? (
        <Loading />
      ) : (
        <div data-test="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: Product) => (
              <div key={product.id} data-test={`product-item-${product.id}`}>
                <img
                  data-test="product-image"
                  src={`/image/${product.imageName}`}
                  alt={product.name}
                />
                <div data-test="search page product info">
                  <h2 data-test="product-name">{product.name}</h2>
                  <p data-test="product-price">Price: ${product.price}</p>
                  <p>Stock: {product.quantity}</p>
                  <p data-test="product-last-ordered-at">
                    last order: {product.lastOrderedAt}
                  </p>
                  <input
                    type="number"
                    min="0"
                    max={product.quantity}
                    defaultValue={product.quantity > 0 ? "0" : "0"}
                    disabled={product.quantity === 0}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}

      <div>
        <button
          data-test="prev-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span data-test="current-page">{currentPage}</span>
        <button
          data-test="next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= hitCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}
