import './navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="background-container">
        <div className="dot-pattern"></div>
      </div>
      
      
        <div className="navbar-logo">
          <a href="https://www.navriti.com" target="_blank" rel="noopener noreferrer">
            <img src="/Navriti.png" alt="Company Logo" />
          </a>
      
      </div>
      
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#products">Product</a></li>
        <li><a href="#contact">Contact Us</a> </li>
      </ul>
      
      
    </div>
  );
}

export default Navbar;