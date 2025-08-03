import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setCurrentUser(userData ? JSON.parse(userData) : null);

    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      setCurrentUser(userData ? JSON.parse(userData) : null);
    };

    // 🔹 Listen for both localStorage change and custom userChange event
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);

    // 🔹 Dispatch userChange event so Navbar updates everywhere
    window.dispatchEvent(new Event('userChange'));

    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            ThoughtsHub
          </Link>
        </div>
        <div className="navbar-menu">
          {!currentUser ? (
            <Link to="/signup" className="navbar-link">
              Sign Up / Sign In
            </Link>
          ) : (
            <>
              <span className="navbar-user">
                Welcome {currentUser.name || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary navbar-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
