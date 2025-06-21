import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <div className="category-form-container p-3 shadow-sm rounded bg-light">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryInput" className="form-label fw-semibold">
            New Category
          </label>
          <input
            id="categoryInput"
            type="text"
            className="form-control"
            placeholder="Enter a new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
