
import DomainCheckModal from '../Components/DomainCheckModal';

import './Home.css';
import { useEffect, useRef, useState } from 'react';
import GoogleLoginBox from '../Components/GoogleLoginBox';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const navigate = useNavigate();
  
const handleYesClick = () => {
  setShowModal(false);
  setShowGoogleLogin(true);
};

const handleNoClick = () => {
  setShowModal(false);
};
const handleLoginClose = () => {
  setShowGoogleLogin(false);
};

const handleLoginSuccess = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  setShowGoogleLogin(false);
  navigate('/home');
};

  const headingRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  return (
    <section id='home' className="home">
      
      <div className="background-container">
        <div className="dot-pattern"></div>
        <div className="arc"></div>
      </div>
      
      
      <div className="home-left">
        <h1
          className={`animated-heading ${isVisible ? 'inView' : ''}`}
          ref={headingRef}
        >
          <span>Simplify</span> <span>Your</span><br />
          <span>Contract</span><br />
          <span>Management</span>
        </h1>
        <p>Upload, Store and Manage contracts securely in one place</p>
        <div className="features-wrapper">
          <div className="feature-card">
            <img src="/cloud2.png" alt="Cloud" className="feature-icon" />
            <p className="feature-title">Secure Cloud<br />Storage</p>
          </div>
          <div className="feature-card">
            <img src="/upload2.png" alt="Upload" className="feature-icon" />
            <p className="feature-title">Easy Upload<br />& Search</p>
          </div>
          <div className="feature-card">
            <img src="/notify1.png" alt="Bell" className="feature-icon" />
            <p className="feature-title">Smart<br />Notifications</p>
          </div>
        </div>
        <div className="get-started-container">
  <a href="#getstarted" className="get-started-link" onClick={() => setShowModal(true)}>
    Get Started
    <img src="/arrow1.png" alt="Arrow" className="arrow-icon" />
  </a>
</div>
{showModal && (
  <DomainCheckModal onConfirm={handleYesClick} onCancel={handleNoClick} />
)}

{showGoogleLogin && (
  <GoogleLoginBox onSuccess={handleLoginSuccess} onClose={handleLoginClose} />
)}
      </div>
     
      
    </section>
  );
}

export default Home;