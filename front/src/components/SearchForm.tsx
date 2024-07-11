import React from "react";
import {useSearchParams} from "react-router-dom";

interface SearchFormProps {
  onSearch: (filter: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({onSearch}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const filter = (event.target as HTMLFormElement).filter.value;
    setSearchParams(filter ? {filter} : {});
    onSearch(filter);
  };

  return (
    <form onSubmit={handleFormSubmit}>
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
  );
};

export default SearchForm;
