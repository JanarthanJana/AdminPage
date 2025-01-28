import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const baseURL = "http://localhost:5000/uploads/";

  function getProducts() {
    fetch("  http://localhost:5000/api/products?_sort=id&_order=asc")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        alert("Unable to get data");
      });
  }

  useEffect(getProducts, []);

  function deleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
  
    fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          getProducts(); // Refresh the product list
        } else if (response.status === 404) {
          alert("Product not found. It may have already been deleted.");
        } else {
          alert("Failed to delete the product. Try again later.");
        }
      })
      .catch(() => {
        alert("Unable to connect to the server. Please try again later.");
      });
  }
  

  return (
    <div className="c my-4">
      <h1 className="text-center mb-4 text-success" >PRODUCTS</h1>

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
          {products.map((product, index) => {
            return (
              <tr key={index}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{"Rs. "+product.price}</td>
                <td>{product.description}</td>
                <td>
                  <img
                    src={
                      `${baseURL}${product.image}`
                    }
                    width="100"
                    alt="..."
                  />
                </td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <Link
                    className="btn btn-primary btn-sm me-1"
                    to={"/admin/products/edit" + product.id}
                  >
                    Edit
                  </Link>
                  <button type="button" className="btn btn-danger btn-sm" onClick={()=>  deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
