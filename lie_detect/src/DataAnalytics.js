// DataAnalytics.js

import React from 'react';
import './styles.css'; // Import your CSS file
import Plot from "react-plotly.js"

const DataAnalytics = () => (
  <section id="data-analytics" className="section">
    <div className="container">
      <h2>Data & Analytics</h2>
      <p>Explore our data-driven insights and analytics.</p>

      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      <div id="graph" style={{width: '100%', height: '500px'}}>
        <Plot 
        data = {[{
          type: 'bar',
          x: ["True Positive Rate", "False Negative Rate", "True Negative Rate", "False Positive Rate"],
          y: [87.0, 13.0, 82.2, 17.8],}]}
        layout={ {width: 1000, height: 700, 
          title: 'Polygraph Accuracy of Control Question Test in Criminal Cases',
          xaxis: {title: 'Test Accuracy'},
          yaxis: { title: 'Percentage of Outcome'}
        }}/>
        <p className="explanation">True Positive: Correctly identifying a deceptive subject.<br></br>
          True Negative: Correctly identifying a non-deceptive subject.<br></br>
          False Positive: Incorrectly identifying a non-deceptive subject as deceptive.<br></br>
          False Negative: Incorrectly identifying a deceptive subject as non-deceptive.<br></br>
        </p>
        </div>
    </div>
  </section>
);

export default DataAnalytics;
