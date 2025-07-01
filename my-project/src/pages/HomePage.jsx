// src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const HomePage = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-8 flex flex-col items-center justify-center text-center">
      <h1 className="font-heading text-4xl font-bold text-primary-700 mb-4">
        Welcome, {user ? user.username : 'Guest'}!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        You are now on the home page for logged-in users.
      </p>
      {user ? (
        <div className="space-y-4">
          <p className="text-md text-gray-600">Your Email: <span className="font-medium">{user.email}</span></p>
          <p className="text-md text-gray-600">Your Role: <span className="font-medium badge bg-secondary-500 text-white px-2 py-1 rounded-md">{user.role}</span></p>
          <Button onClick={logout} variant="outline" size="lg" className="mt-6">
            Logout
          </Button>
        </div>
      ) : (
        <p className="text-md text-gray-600">Please login or register to access full features.</p>
      )}
    </div>
  );
};

export default HomePage;