import React from 'react';
import './styles.css';
import Plot from "react-plotly.js"
import {usestate} from "react";

const PolygraphChart = () => {

    const barData = [
      {
        type: "bar",
        x: ["True Positive Rate", "False Negative Rate", "True Negative Rate", "False Positive Rate"],
        y: [87.0, 13.0, 82.2, 17.8]
      },
    ];
      
    const pieData = [
      {
        type: 'bar',
        x: ["True Positive Rate", "False Negative Rate", "True Negative Rate", "False Positive Rate"],
        y: [87.0, 13.0, 82.2, 17.8]
      }
    ];

    return(
        <Plot
            data={barData}
            layout={{
                width: 1000, height: 700, 
                title: 'Polygraph Accuracy of Control Question Test in Criminal Cases',
                xaxis: {title: 'Test Accuracy'},
                yaxis: { title: 'Percentage of Outcome'}
            }}
        />
    );
}

export default PolygraphChart;