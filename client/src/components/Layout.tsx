import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Mini-SaaS
          </Link>
          <div className="space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-200 text-center py-4">
        © {new Date().getFullYear()} Mini-SaaS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
