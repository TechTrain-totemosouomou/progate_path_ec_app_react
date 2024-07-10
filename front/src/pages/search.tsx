import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Product} from "../types";

export function SearchPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [hitCount, setHitCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching products...");
        const page = searchParams.get("page")
          ? parseInt(searchParams.get("page")!, 10)
          : 1;
        const filter = searchParams.get("filter") || "";
        const response = await fetch(
          `/api/products/search?filter=${filter}&page=${page}`,
        );
        console.log("Response received:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("Data received:", data);
        setProducts(data.products);
        setHitCount(data.hitCount);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [searchParams, currentPage]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const filter = (event.target as HTMLFormElement).filter.value;
    setSearchParams(filter ? {filter} : {});
  };

  const handlePageChange = (newPage: number) => {
    const filterValue = searchParams.get("filter");
    setSearchParams(
      filterValue
        ? {filter: filterValue, page: newPage.toString()}
        : {page: newPage.toString()},
    );
  };

  const filteredProducts = products;

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="filter"
          defaultValue={searchParams.get("filter") || ""}
          data-test="search-input"
        />
        <button data-test="search-button" type="submit">
          Search
        </button>
      </form>

      <div data-test="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
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
                  Last Ordered: {product.lastOrderedAt}
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
