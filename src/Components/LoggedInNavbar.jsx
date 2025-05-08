import './LoggedInNavbar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from "../../firebase/firebase-config";

function LoggedInNavbar({ userEmail }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate('/');
  };

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  const initial = getInitial(userEmail);

  return (
    <div className="loggednavbar">
    <div className="navbar-left">
      <div className="loggednavbar-logo">
        <a href="https://www.navriti.com" target="_blank" rel="noopener noreferrer">
          <img src="/Navriti.png" alt="Company Logo" />
        </a>
        </div>
      </div>
      <div className="navbar-right">
      <ul className="loggednav-links">
        <li><a href="#">Dashboard</a></li>
      </ul>

      <div className="profile-container">
        <div className="profile-circle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {initial}
        </div>
        {dropdownOpen && (
  <div className="dropdown-menu">
    <button onClick={handleSignOut}>Sign Out</button>
  </div>
)}
      </div>
      </div>
    </div>
  );
}

export default LoggedInNavbar;