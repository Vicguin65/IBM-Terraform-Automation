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
        layout={{
          width: 1000, height: 700, 
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


        {/* Second Graph */}
        <div className="neuralnetworks" id="networks"></div>
        {/* Graph based on neural network models for polygraph testing */}
        <Plot
         data = {[{
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
          },
        ]}
        layout={{
          width: 1000, height: 700,
          barmode: 'group',
          title: 'Performance of Four Neural Network Models in Lie Detection',
          yaxis: { title: 'Percentage', range: [90, 100] },
          xaxis: { title: 'Neural Network Type' },
         }}        
        />
    </div>
    <p className="explanation">
      The data in the graph showcases the efficiency of four common different neural network models 
      used for polygraph lie detection. They are as follows:<br></br><br></br>

      <ul>
      <li>ERNN: Explainable Enhanced Recurrent Neural Network: 
        <ul><li style={{ listStylePosition: "inside" }}>
          A variant of RNN that focuses on providing explainability alongside improved performance.
          </li>
        </ul>
      </li><br></br>

      <li>ANN: Artificial Neural Network:
        <ul><li style={{ listStylePosition: "inside" }}>
        A computational model inspired by the way biological neural 
      networks in the human brain process information. It consists of layers of interconnected nodes (neurons) 
      that process data in a hierarchical manner.
          </li>
        </ul>
      </li><br></br>

      <li>RNN: Recurrent Neural Network:
      <ul><li style={{ listStylePosition: "inside" }}>
        A type of neural network where connections between nodes can create 
        cycles, allowing the network to maintain a form of memory. This makes RNNs particularly well-suited for 
        sequential data, such as time series or text.
        </li>
      </ul> 
      </li><br></br>

      <li>LSTM: Long Short-Term Memory: 
      <ul><li style={{ listStylePosition: "inside" }}>
        A special kind of RNN designed to better handle long-term dependencies. 
        LSTMs use memory cells that can maintain information in memory for long periods, making them effective 
        for tasks requiring the understanding of context over time.
        </li>
      </ul>  
      </li><br></br>
      </ul>
    </p>

  <div id="concluding-paragraph">
    {/* style={{
      display: 'block',
      maxWidth: '1000px',
      width: '1000px', 
      marginTop: '100px', 
      fontSize: '25px',}} */}
    <p className="conclusion" style={{
      display: 'block',
      maxWidth: '1000px',
      width: '1000px', 
      marginTop: '100px', 
      fontSize: '25px',}}>
    Using control question tests, polygraphs are mostly able to identify criminal and exclude innocents. However,
    a high false positive rate and false negative rate stil exist. Polygraphs can provide some insight into deceit
    but they may not be the most reliable tool for the most critical of situations in criminal cases. 
    Neural network models offer a promising alternative with higher accuracy and consistency. Yet, the polygraph
    will still remain a useful tool in lie detection.<br></br>
    </p>
  </div>
  </section>
);

export default DataAnalytics;
