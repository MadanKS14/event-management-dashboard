// src/pages/LoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios
import FormInput from '../components/FormInput';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Initialize the navigate function
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Make the function async to handle the API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your backend's login endpoint
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // On success, the backend sends back a token
      const { token } = response.data;
      
      // Save the token to localStorage
      localStorage.setItem('token', token);
      
      alert('Login successful!');

      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      console.error('Login error:', error.response.data.message);
      alert(`Login failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="bg-[#0A1931] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#122142] p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back!</h2>
        <p className="text-center text-gray-400 mb-6">Log in to manage your events.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput id="email" label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
          <FormInput id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          
          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300">
            Log In
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;