import React from "react";
import "./Product.css";

import certiplateLogo from "../assets/certiplate.png";  
import kaushalMitraLogo from "../assets/KM.png";
import careerMapLogo from "../assets/CareerMap_Logo.png";

const Product = () => {
  return (
    <section className="product-section" id="products">
      <h2 className="product-title">Our Products</h2>
      <div className="product-container">
        <div className="product-card">
          <a href="https://navriti.com/products/certiplate/">
            <div className="logo-container">
             
              <img src={certiplateLogo} alt="Certiplate" className="product-logo" />
            </div>
          </a>
          <p>
            An AI-enabled proctored assessment management system that helps customers conduct credible, fair, transparent & secured online or offline assessments for any skill. It comes with various add-on features such as support for question bank development, invigilation services, evaluation support, data entry support and sourcing of assessor(s)/examiner(s).
          </p>
        </div>

        <div className="product-card">
          <a href="https://navriti.com/products/kaushal-mitra/">
            <div className="logo-container">
              
              <img src={kaushalMitraLogo} alt="Kaushal Mitra" className="product-logo" />
            </div>
          </a> 
          <p>
            A unique skilling solution unifying education with skills & industry exposure by involving the employer as well as industry practitioner(s) to make the overall skilling intervention more relevant from an employment perspective, thereby ensuring better income/wage opportunities for each learner. Presently, it is being provided to the colleges offering technical/professional courses or the skill development companies/organizations.
          </p>
        </div>

        <div className="product-card">
          <a href="https://navriti.com/products/career-map/">
            <div className="logo-container">
              
              <img src={careerMapLogo} alt="Career Map" className="product-logo" />
            </div>
          </a>
          <p>
            A scientifically designed tool to help schools or parents gauge the interest and suitability of their students/kids and identify the right career path for them. It also helps the skill development companies/organizations do a fitment analysis for their mobilized/enrolled candidates to aid them in aligning the right course/skill track to each candidate.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Product;