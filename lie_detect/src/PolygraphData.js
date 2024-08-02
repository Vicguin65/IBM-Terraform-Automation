import React, {useState} from 'react';
import './styles.css';
import Plot from "react-plotly.js";

const PolygraphChart = () => {

   const [graphType, changeGraph] = useState("bar");

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


    DisplayGraph()
    {
      if(graphType === "bar")
      {
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
      else if(graphType === "pie")
      {
        return(
          <Plot
              data={pieData}
              layout={{
                  width: 1000, height: 700, 
                  title: 'Polygraph Accuracy of Control Question Test in Criminal Cases',
                  xaxis: {title: 'Test Accuracy'},
                  yaxis: { title: 'Percentage of Outcome'}
              }}
          />
        );
      }
    }

    return(
      <div>
         <button onClick={() => setChartType('bar')}>Bar Chart</button>
         <button onClick={() => setChartType('pie')}>Pie Chart</button>
         {DisplayGraph}
      </div>
    );
}

export default PolygraphChart;