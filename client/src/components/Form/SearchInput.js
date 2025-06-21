import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/products/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="input-group shadow-sm rounded">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search for medicines, brands..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) =>
            setValues({ ...values, keyword: e.target.value })
          }
        />
        <button className="btn btn-success btn-danger" type="submit">
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
