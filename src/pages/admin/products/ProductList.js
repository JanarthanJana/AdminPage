import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

export default function ProductList() {
  const { user, dispatch } = useContext(AuthContext); // Auth context to get user (token)
  const [products, setProducts] = useState([]);
  const baseURL = "http://localhost:5000/uploads/";

  // Axios configuration
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${user}`, // Attach the token to all requests
    },
  });

  // Fetch products
  const getProducts = async () => {
    try {
      const response = await axiosInstance.get("/products?_sort=id&_order=asc");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Unable to get data. Please try again.");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response.status === 200) {
        alert("Product deleted successfully.");
        getProducts(); // Refresh the product list
      } else {
        alert("Failed to delete the product. Try again later.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response && error.response.status === 404) {
        alert("Product not found. It may have already been deleted.");
      } else {
        alert("Unable to delete the product. Please try again later.");
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="c my-4">
      <h1 className="text-center mb-4 text-dark font-extrabold">PRODUCTS</h1>

      <div className="row md-3">
        <div className="col">
          <Link
            className="btn btn-primary me-1"
            to="/admin/products/create"
            role="button"
          >
            Create Product
          </Link>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={getProducts}
          >
            Refresh
          </button>
        </div>
        <div className="col"></div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>{"Rs. " + product.price}</td>
              <td>{product.description}</td>
              <td>
                <img
                  src={`${baseURL}${product.image}`}
                  width="100"
                  alt={product.name}
                />
              </td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <Link
                  className="btn btn-primary btn-sm me-1"
                  to={`/admin/products/edit/${product._id}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
