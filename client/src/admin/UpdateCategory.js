import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import Base from "../core/Base";

import { getaCategory, updateCategory } from "./helper/adminapicall";

export default function UpdateCategory({ match }) {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAutheticated();

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };
  useEffect(() => {
    getaCategory(match.params.categoryId)
      .then((category) => {
        setName(category.name);
      })
      .catch((err) => console.log(err));
  }, []);
  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //BE Request
    updateCategory(match.params.categoryId, user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => console.log(err));
  };
  const successMessage = () => {
    //
    if (success) {
      return <h4 className="text-success">Category Updated Successfully</h4>;
    }
  };
  const warningMessage = () => {
    //
    if (error) {
      return <h4 className="text-danger">Failed to Update Category</h4>;
    }
  };
  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control my-3"
          autoFocus
          onChange={handleChange}
          value={name}
          onClick={() => onSubmit}
          required
          placeholder="For Ex. Summer"
        />
        <button onClick={onSubmit} className="btn btn-outline-info">
          Update Category
        </button>
      </div>
    </form>
  );
  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );
  return (
    <Base
      title="Create a category here"
      description="Add a new category for new tshirts"
      className="container"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
}
