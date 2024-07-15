// DataAnalytics.js

import React from 'react';
import './styles.css'; // Import your CSS file
import jpegImage from './assets/jpeg.jpeg'; // Adjust the path based on where exactly it's located within src

const DataAnalytics = () => (
  <section id="data-analytics" className="section">
    <div className="container">
      <h2>Data & Analytics</h2>
      <p>Explore our data-driven insights and analytics.</p>
      <img src={jpegImage} alt="Data Analytics Image" />
    </div>
  </section>
);

export default DataAnalytics;
