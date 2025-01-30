import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Send login credentials to the backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: username,
        password: password,
      });

      // Check if the response contains a token
      if (response.data && response.data.token) {
        // Update AuthContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.token,
        });

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);

        // Navigate to the ProductList page
        navigate("/admin/products");
      } else {
        alert("Login failed: Invalid server response.");
      }
    } catch (error) {
      // Handle errors from server or network issues
      console.error("Login Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "An error occurred. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="container w-4/5 mx-auto m-5 border border-black flex justify-center items-center flex-col">
      <div className="m-5">
        <label className="mr-10">Username</label>
        <input
          type="text"
          className="border border-b-black p-1"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="m-5">
        <label className="mr-10">Password</label>
        <input
          type="password"
          className="border border-b-black p-1"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="m-5" >
        <button
        id="loginbtn"
          className="border border-black p-1 "
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <div className="m-5 ">
        <p className="text-sm m-5 text-gray-500 text-center">
          Don't have an account?{" "}
          <button
          id="createonebtn"
            className=" btn btn-transparent"
            onClick={() => navigate("/register")}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
