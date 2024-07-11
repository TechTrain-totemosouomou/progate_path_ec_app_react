import {Loading} from "../components/loading";
import SearchForm from "../components/SearchForm";
import useProductSearch from "../hooks/useProductSearch";
import {useCart} from "../context/CartContext";
import ProductList from "../components/ProductList";

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

  const {updateCart, cart} = useCart();

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateCart(productId, quantity);
  };

  const handleSearch = (filter: string) => {
    setSearchParams({filter});
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />

      {loading ? (
        <Loading />
      ) : (
        <ProductList
          products={products}
          cart={cart}
          onQuantityChange={handleQuantityChange}
        />
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
