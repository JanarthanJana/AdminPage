import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Style.css';


const Register = () => {
  const navigate = useNavigate(); // Uncommented for navigation
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRegister = () => {
    axios
      .post('http://localhost:5000/api/auth/register', {
        name: name,
        email: username,
        password: password,
        isAdmin: isAdmin
      })
      .then((res) => {
        console.log(res.data);
        alert("Registration successful!");
        setName(""); // Reset the name input
        setUsername(""); // Reset the username input
        setPassword(""); // Reset the password input
        setIsAdmin(false);
        navigate("/login"); // Redirect to login page
      })
      .catch((err) => {
        if(name==""||password==""||username==""){
          alert("Please fill in all fields!");
        }
        else{
        console.error(err);
        alert("Registration failed. Please try again.");
        navigate("/register");
      }
      });
  };

  return (
    <div className="container w-4/5 mx-auto m-5 border border-black flex justify-center items-center flex-col">
      <div className="m-5">
        <label className="mr-10">Name</label>
        <input
          type="text"
          className="border border-b-black p-1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
          type="password" // Changed type to "password" for security
          className="border border-b-black p-1"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-group m-5  " >
          <label htmlFor="isAdmin" className='me-3'>Is Admin</label>

          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </div>
      <div className="m-5  ">
        <button id='registerbtn'
          className="border border-black p-1  btn btn-primary"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
