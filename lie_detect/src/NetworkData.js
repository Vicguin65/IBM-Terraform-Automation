import React, { useState } from 'react';
import './styles.css';
import Plot from "react-plotly.js"
import {usestate} from "react";

const NetworkChart = () => {
    //use state to switch graphs
    const [graphType, changeGraph] = useState("bar");

    const barData = [
      {
        name: 'Accuracy',
        x: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        y: [97.3, 95.4, 96.4, 96.9],
        type: 'bar',
        marker: { color: 'black' },
      },
      {
        name: 'Precision',
        x: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        y: [97.9, 94.7, 94, 97],
        type: 'bar',
        marker: { color: '#D4A76A' },
      },
      {
        name: 'Recall',
        x: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        y: [98.1, 95.2, 97.1, 97.5],
        type: 'bar',
        marker: { color: 'gray' },
      },
      {
        name: 'F1-score',
        x: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        y: [97.77, 94.56, 96.66, 96.63],
        type: 'bar',
        marker: { color: 'lightgray' },
      }
    ];
  
    const pieData = [
      {
        name: 'Accuracy',
        labels: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        values: [97.3, 95.4, 96.4, 96.9],
        type: 'pie',
        marker: { color: 'black' },
      },
      {
        name: 'Precision',
        labels: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        values: [97.9, 94.7, 94, 97],
        type: 'pie',
        marker: { color: '#D4A76A' },
      },
      {
        name: 'Recall',
        labels: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        values: [98.1, 95.2, 97.1, 97.5],
        type: 'pie',
        marker: { color: 'gray' },
      },
      {
        name: 'F1-score',
        labels: ['ERNN', 'ANN', 'RNN', 'LSTM'],
        values: [97.77, 94.56, 96.66, 96.63],
        type: 'pie',
        marker: { color: 'lightgray' },
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

  export default NetworkChart;