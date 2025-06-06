import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Mini-SaaS</h1>
      <p className="mb-6">A demo full-stack app to showcase authentication, roles, and CRUD.</p>
      <Link
        to="/register"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
