import React, { useState } from 'react';
import './styles.css';
import Plot from "react-plotly.js";

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

    function DisplayGraph() 
    {
      if(graphType === "bar")
      {
        return(
            <Plot
                data={barData}
                layout={{
                  width: 1000, height: 700,
                  barmode: 'group',
                  title: 'Performance of Four Neural Network Models in Lie Detection',
                  yaxis: { title: 'Percentage', range: [90, 100] },
                  xaxis: { title: 'Neural Network Type' },
                }}
            />
        );
      }

      if(graphType === "pie")
      {
        return (
          <Plot
            data={pieData}
            layout={{
              width: 1000, height: 700,
              barmode: 'group',
              title: 'Performance of Four Neural Network Models in Lie Detection',
              yaxis: { title: 'Percentage', range: [90, 100] },
              xaxis: { title: 'Neural Network Type' },
            }}
          />
        );
      }
    }


    return(
      <div>
         <button onClick={() => changeGraph('bar')}>Bar Chart</button>
         <button onClick={() => changeGraph('pie')}>Pie Chart</button>
         {DisplayGraph()}
      </div>
    );
  }

  export default NetworkChart;