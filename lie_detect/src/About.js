import React from 'react';
import './styles.css'; // Ensure this path is correct

const About = () => {
  return (
    <section className="container">
      <h2 className="mission-title-container">Our Mission</h2>
      <div className="mission-statement">
        <img 
          src={require("./assets/court.webp")} 
          alt="About Image" 
          className="about-image" 
        />
        <div className="mission-text">
          <p>
            Our mission is to rigorously investigate and enhance the effectiveness of lie detection methods in criminal cases. We are dedicated to ensuring the integrity and reliability of truth verification techniques, aiming to bolster the judicial process and uphold justice. By conducting comprehensive research, analyzing data, and developing advanced methodologies, we strive to improve the accuracy and credibility of lie detection tools such as polygraph tests. Our commitment to scientific excellence and ethical standards drives us to provide law enforcement, legal professionals, and the broader community with reliable information and innovative solutions for detecting deception. We believe that through meticulous research and continuous improvement, we can contribute to a more just and transparent legal system, ensuring that truth prevails in the pursuit of justice.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;



