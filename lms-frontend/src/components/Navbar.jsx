import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar glass-card">
      <div className="container nav-content">
        <Link to={token ? "/dashboard" : "/login"} className="nav-logo">
          <BookOpen className="logo-icon" />
          <span>LMS Platform</span>
        </Link>
        
        {token && (
          <div className="nav-links">
            <Link to="/courses" className="nav-item">Courses</Link>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
          </div>
        )}

        <div className="nav-auth">
          {token ? (
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="btn-primary">
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
