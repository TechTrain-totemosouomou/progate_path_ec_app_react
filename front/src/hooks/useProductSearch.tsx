import {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Product} from "../types";

type UseProductSearchReturnType = {
  products: Product[];
  hitCount: number;
  currentPage: number;
  loading: boolean;
  setSearchParams: (params: {filter?: string; page?: string}) => void;
  handlePageChange: (newPage: number) => void;
  itemsPerPage: number;
};

const useProductSearch = (): UseProductSearchReturnType => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hitCount, setHitCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage: number = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const page: number = searchParams.get("page")
          ? parseInt(searchParams.get("page")!, 10)
          : 1;
        const filter: string = searchParams.get("filter") || "";
        const response = await fetch(
          `/api/products/search?filter=${filter}&page=${page}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const convertToLocalTime = (isoDateString?: string): string => {
          if (!isoDateString) return "";
          const date = new Date(isoDateString);
          const formattedDate = `${date.getFullYear()}/${
            date.getMonth() + 1
          }/${date.getDate()}`;
          return formattedDate;
        };

        const productsWithLocalTime: Product[] = data.products.map(
          (product: Product) => ({
            ...product,
            lastOrderedAt: convertToLocalTime(product.lastOrderedAt),
          }),
        );

        setProducts(productsWithLocalTime);
        setHitCount(data.hitCount);
        setCurrentPage(page);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, currentPage]);

  const handlePageChange = (newPage: number): void => {
    const filterValue: string | null = searchParams.get("filter");
    setSearchParams(
      filterValue
        ? {filter: filterValue, page: newPage.toString()}
        : {page: newPage.toString()},
    );
  };

  return {
    products,
    hitCount,
    currentPage,
    loading,
    setSearchParams,
    handlePageChange,
    itemsPerPage,
  };
};

export default useProductSearch;
