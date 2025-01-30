import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [validationErrors, setValidationErrors] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const product = Object.fromEntries(formData.entries());

    // Validation
    let validationErrors = {};
    if (!product.name || product.name.trim().length === 0) {
      validationErrors.name = "Name is required.";
    }
    if (!product.price || product.price <= 0) {
      validationErrors.price = "Price must be a positive number.";
    }
    if (!product.description || product.description.trim().length < 10) {
      validationErrors.description = "Description must be at least 10 characters.";
    }
    if (!formData.get("image") || formData.get("image").name === "") {
      validationErrors.image = "Image is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
        headers: {
          // No 'Content-Type' header since `fetch` automatically sets it for `FormData`
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Product created successfully
        navigate("/admin/products");
      } else if (response.status === 400) {
        setValidationErrors(data);
      } else {
        alert("Unable to create the product!");
      }
    } catch (error) {
      alert("Unable to connect to the server!");
    }
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto border p-4">
          <h2 className="text-center mb-5">Create Product</h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input className="form-control" id="name" name="name" />
              {errors.name && (
                <span className="text-danger">
                  {validationErrors.name || errors.name}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="form-group mb-3">
              <label htmlFor="price">Price</label>
              <input
                className="form-control"
                id="price"
                name="price"
                step="0.01"
                min="1"
              />
              {errors.price && (
                <span className="text-danger">
                  {validationErrors.price || errors.price}
                </span>
              )}
            </div>

          

            {/* Description */}
            <div className="form-group mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
              ></textarea>
              {errors.description && (
                <span className="text-danger">
                  {validationErrors.description || errors.description}
                </span>
              )}
            </div>

            {/* Image */}
            <div className="form-group mb-3">
              <label htmlFor="image">Image</label>
              <input
                className="form-control"
                id="image"
                name="image"
                type="file"
              />
              {errors.image && (
                <span className="text-danger">
                  {validationErrors.image || errors.image}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="row">
              <div className="col-sm-6 d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col-sm-6 d-grid">
                <Link
                  className="btn btn-secondary"
                  to="/admin/products"
                  role="button"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
