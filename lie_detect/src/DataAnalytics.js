import React from 'react';
import './styles.css'; // Import your CSS file
import Plot from "react-plotly.js";

const DataAnalytics = () => (
  <section id="data-analytics" className="section">
    <div className="container">
      <div className="data-analytics-title-container">
        <h2 className="data-analytics-title">Data & Analytics</h2>
      </div>

      <div id="data-analytics-image" className="plot-container">
        <Plot 
          data={[{
            type: 'bar',
            x: ["True Positive Rate", "False Negative Rate", "True Negative Rate", "False Positive Rate"],
            y: [87.0, 13.0, 82.2, 17.8],
          }]}
          layout={{
            width: 900, height: 600, 
            title: 'Polygraph Accuracy of Control Question Test in Criminal Cases',
            xaxis: {title: 'Test Accuracy'},
            yaxis: { title: 'Percentage of Outcome'}
          }}
        />
        <p className="data-analytics-explanation">
          True Positive: Correctly identifying a deceptive subject.<br />
          True Negative: Correctly identifying a non-deceptive subject.<br />
          False Positive: Incorrectly identifying a non-deceptive subject as deceptive.<br />
          False Negative: Incorrectly identifying a deceptive subject as non-deceptive.<br />
        </p>
      </div>

      <div className="image-text-container">
        <img src="path/to/your/image.jpg" alt="Description" className="data-analytics-image" />
        <div className="data-analytics-text">
          <Plot
            data={[{
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
              width: 900, height: 600,
              barmode: 'group',
              title: 'Performance of Four Neural Network Models in Lie Detection',
              yaxis: { title: 'Percentage', range: [90, 100] },
              xaxis: { title: 'Neural Network Type' },
            }}        
          />
          <p className="data-analytics-explanation">
            The data in the graph showcases the efficiency of four common different neural network models 
            used for polygraph lie detection. They are as follows:<br /><br />

            <ul>
              <li>ERNN: Explainable Enhanced Recurrent Neural Network: 
                <ul><li style={{ listStylePosition: "inside" }}>
                  A variant of RNN that focuses on providing explainability alongside improved performance.
                </li></ul>
              </li><br />

              <li>ANN: Artificial Neural Network:
                <ul><li style={{ listStylePosition: "inside" }}>
                  A computational model inspired by the way biological neural 
                  networks in the human brain process information. It consists of layers of interconnected nodes (neurons) 
                  that process data in a hierarchical manner.
                </li></ul>
              </li><br />

              <li>RNN: Recurrent Neural Network:
                <ul><li style={{ listStylePosition: "inside" }}>
                  A type of neural network where connections between nodes can create 
                  cycles, allowing the network to maintain a form of memory. This makes RNNs particularly well-suited for 
                  sequential data, such as time series or text.
                </li></ul>
              </li><br />

              <li>LSTM: Long Short-Term Memory: 
                <ul><li style={{ listStylePosition: "inside" }}>
                  A special kind of RNN designed to better handle long-term dependencies. 
                  LSTMs use memory cells that can maintain information in memory for long periods, making them effective 
                  for tasks requiring the understanding of context over time.
                </li></ul>
              </li><br />
            </ul>
          </p>
        </div>
      </div>

      <div id="concluding-paragraph">
        <p className="conclusion" style={{
          display: 'block',
          maxWidth: '1000px',
          width: '1000px', 
          marginTop: '100px', 
          fontSize: '20px',
        }}>
          Using control question tests, polygraphs are mostly able to identify criminal and exclude innocents. However,
          a high false positive rate and false negative rate still exist. Polygraphs can provide some insight into deceit
          but they may not be the most reliable tool for the most critical situations in criminal cases. 
          Neural network models offer a promising alternative with higher accuracy and consistency. Yet, the polygraph
          will still remain a useful tool in lie detection.<br />
        </p>
      </div>
    </div>
  </section>
);

export default DataAnalytics;
