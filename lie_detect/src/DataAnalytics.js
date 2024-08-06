import React from 'react';
import './styles.css'; // Import your CSS file
import Plot from "react-plotly.js"
import NetworkChart from './NetworkData.js';
import PolygraphChart from './PolygraphData.js';

const DataAnalytics = () => (
  <section id="data-analytics" className="section">
    <div className="container">
      <h2 className="data-analytics-title">Data & Analytics</h2>

      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

      <div id="graph" style={{width: '100%', height: '500px', marginBottom: '20px',}}>
        {<PolygraphChart />}
      
        <p className="explanation">True Positive: Correctly identifying a deceptive subject.<br></br>
          True Negative: Correctly identifying a non-deceptive subject.<br></br>
          False Positive: Incorrectly identifying a non-deceptive subject as deceptive.<br></br>
          False Negative: Incorrectly identifying a deceptive subject as non-deceptive.<br></br>
        </p>
      </div>
    {/* Second Graph */}
    <div className="neuralnetworks" id="networks"></div>
    {/* Graph based on neural network models for polygraph testing */}
    { <NetworkChart /> }   
    <div>
    <p className="explanation">
      The data in the graph showcases the efficiency of four common different neural network models 
      used for polygraph lie detection. They are as follows:<br></br><br></br>

        <ul>
          <li>ERNN: Explainable Enhanced Recurrent Neural Network: 
            <ul><li style={{ listStylePosition: "inside" }}>
              A variant of RNN that focuses on providing explainability alongside improved performance.
            </li></ul>
          </li><br></br>

          <li>ANN: Artificial Neural Network:
            <ul><li style={{ listStylePosition: "inside" }}>
              A computational model inspired by the way biological neural 
              networks in the human brain process information. It consists of layers of interconnected nodes (neurons) 
              that process data in a hierarchical manner.
            </li></ul>
          </li><br></br>

          <li>RNN: Recurrent Neural Network:
            <ul><li style={{ listStylePosition: "inside" }}>
              A type of neural network where connections between nodes can create 
              cycles, allowing the network to maintain a form of memory. This makes RNNs particularly well-suited for 
              sequential data, such as time series or text.
            </li></ul>
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
  </div>
  <div id="concluding-paragraph">
    <p className="conclusion" style={{
      display: 'block',
      maxWidth: '1000px',
      width: '1000px', 
      marginTop: '100px', 
      fontSize: '20px',}}>
    Using control question tests, polygraphs are mostly able to identify criminal and exclude innocents. However,
    a high false positive rate and false negative rate stil exist. Polygraphs can provide some insight into deceit
    but they may not be the most reliable tool for the most critical of situations in criminal cases. 
    Neural network models offer a promising alternative with higher accuracy and consistency. Yet, the polygraph
    will still remain a useful tool in lie detection.<br></br>
    </p>
  </div>
  </div>
  </section>
);

export default DataAnalytics;

