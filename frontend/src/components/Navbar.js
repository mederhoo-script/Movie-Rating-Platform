import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 Movie Rating Platform
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Movies</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/movies/add" className="navbar-link">Add Movie</Link>
              <span className="navbar-user">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
