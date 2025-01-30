import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = "http://localhost:5000/uploads/";

  // Fetch product data by ID
  const getProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) throw new Error("Unable to fetch product details");
      const data = await response.json();
      //console.log(data)
      setInitialData(data);
    } catch (error) {
      alert("Error: Unable to fetch product details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Client-side Validation
    const product = Object.fromEntries(formData.entries());
    const errors = {};
    if (!product.name || product.name.trim() === "") {
      errors.name = "Name is required.";
    }
    if (!product.price || product.price <= 0) {
      errors.price = "Price must be a positive number.";
    }
    
    if (!product.description || product.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/admin/products");
      } else if (response.status === 400) {
        const data = await response.json();
        setValidationErrors(data.errors || {});
      } else {
        alert("Error: Unable to update the product. Please try again.");
      }
    } catch {
      alert("Error: Unable to connect to the server. Please try again later.");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto border p-4">
          <h2 className="text-center mb-5">Edit Product</h2>

          {/* Display ID */}
          <div className="form-group mb-3">
            <label htmlFor="id">ID</label>
            <input
              className="form-control-plaintext"
              id="id"
              defaultValue={id}
              readOnly
            />
          </div>

          {initialData && (
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  className="form-control"
                  id="name"
                  name="name"
                  defaultValue={initialData.name}
                />
                {validationErrors.name && (
                  <span className="text-danger">{validationErrors.name}</span>
                )}
              </div>

              {/* Price */}
              <div className="form-group mb-3">
                <label htmlFor="price">Price</label>
                <input
                  className="form-control"
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="1"
                  defaultValue={initialData.price}
                />
                {validationErrors.price && (
                  <span className="text-danger">{validationErrors.price}</span>
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
                  defaultValue={initialData.description}
                ></textarea>
                {validationErrors.description && (
                  <span className="text-danger">
                    {validationErrors.description}
                  </span>
                )}
              </div>

              {/* Current Image */}
              <div className="form-group mb-3">
                <label>Current Image</label>
                <div>
                  <img
                    src={`${baseURL}${initialData.image || "default.jpg"}`}
                    alt="Product"
                    width="150"
                  />
                </div>
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
                {validationErrors.image && (
                  <span className="text-danger">{validationErrors.image}</span>
                )}
              </div>

              {/* Created At */}
              <div className="form-group mb-3">
                <label htmlFor="createdAt">Created At</label>
                <input
                  className="form-control-plaintext"
                  id="createdAt"
                  readOnly
                  defaultValue={initialData.createdAt.slice(0, 10)}
                />
              </div>

              {/* Buttons */}
              <div className="row">
                <div className="col-sm-6 d-grid">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
                <div className="col-sm-6 d-grid">
                  <Link className="btn btn-secondary" to="/admin/products">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
