// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import toast
import FormInput from '../components/FormInput';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="bg-[#0A1931] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#122142] p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Create Your Account</h2>
        <p className="text-center text-gray-400 mb-6">Join EventaSphere today!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput id="name" label="Full Name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
          <FormInput id="email" label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
          <FormInput id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          <button type="submit" className="w-full bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;