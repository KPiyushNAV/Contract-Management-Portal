import React from "react";
import "./Contact.css";
import { FaLinkedin, FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
      
        <div className="contact-left">
          <h2 className="contact-title">Contact Us</h2>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" className="contact-input" />
            <input type="email" placeholder="Your Email" className="contact-input" />
            <textarea placeholder="Your Message" className="contact-textarea"></textarea>
            <button type="submit" className="contact-button">Send</button>
          </form>
        </div>

        
        <div className="contact-right">
          <h2 className="connect-title">Connect with Us</h2>
          <div className="social-icons">
            <a href="https://www.linkedin.com/company/navriti-technologies?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/navrititechnologies/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://x.com/navrititech" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTwitter />
            </a>
            
            <a href="https://www.youtube.com/channel/UCNuJbyTGu0WgyLvTFiYxoPg" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;