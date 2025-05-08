import React from 'react';
import aboutImage from '../assets/About.png';
import './About.css'; 

const About = () => {
  return (
    <section id="about" className="about-section">
      {/* Added background container with dot pattern */}
      <div className="background-container">
        <div className="dot-pattern"></div>
      </div>
      
      <div className="about-container">
        <div className="about-image-container">
          <div className="about-image">
            <img src={aboutImage} alt="About Us" />
            {/* Added design elements to integrate image */}
            <div className="image-accent top-left"></div>
            <div className="image-accent bottom-right"></div>
          </div>
        </div>
        
        <div className="about-text">
          <h2>— NAVRITI</h2>
          <p>
            Navriti Technologies is one of the leading Skill Assessment companies in India. 
            Our vision is to build the world's largest Skill Registry of certified and employable individuals. 
            We are on a mission to identify and aggregate the information of the certified skills of every 
            employable individual and provide them a platform to showcase their skills to make it universally 
            accessible and useful, thus leading to better livelihoods. Towards this 
            mission, we have already assessed, certified, and pooled in more than 1.3 million individuals across the
            entire country in sectors ranging from Leather, Textile, Security to Retail, BFSI, Telecom & IT. We have partnered 
            with more than 2000 SMEs (Subject Matter Experts) & Sector Experts who help us with the assessment and evaluation of the skills.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;