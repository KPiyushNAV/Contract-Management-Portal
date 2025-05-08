import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase/firebase-config";
import './GoogleLoginBox.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GoogleLoginBox({ onSuccess, onClose }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email.endsWith("@gmail.com")) {
        onSuccess(result.user); 
      } else {
        toast.error("Invalid email. Please use a @navriti.com email.", {
            position: "top-right",
            autoClose: 5000,
        })
        auth.signOut(); 
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="google-login-overlay">
      <div className="google-login-box">
        <button className="close-button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        
        <div className="login-container">
          <div className="login-image-section">
            <div className="welcome-text">
              <h2>Welcome to Navriti Contract Management Portal</h2>
            </div>
          </div>
          
          <div className="login-form-section">
            <h3>Login</h3>
            
            <button className="google-button" onClick={handleLogin}>
              <img src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google logo" className="google-icon" />
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default GoogleLoginBox;