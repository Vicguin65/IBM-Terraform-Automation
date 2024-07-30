// Resources.js
import React from 'react';
import './styles.css'; // Make sure to include your CSS file
import {Link} from 'react-router-dom';

const links = [
  { url: 'https://nap.nationalacademies.org/read/10420/chapter/7'},
  { url: 'https://www.mdpi.com/2078-2489/14/10/564'},
  { url: 'https://link.springer.com/article/10.1007/s11042-023-16769-w'},
  { url: 'https://pubmed.ncbi.nlm.nih.gov/31282623/'},
];

const Resources = () => {
  return (
    <div className="resources">
      <section id="resources" className="section">
        <div className="container">
          <h2>Resources</h2>
          <p>Find useful resources and tools.</p>
          <p className="resources">
          “The Polygraph and Lie Detection" at Nap.Edu.” 5 Evidence
           from Polygraph Research: Quantitative Assessment | The Polygraph 
           and Lie Detection | The National Academies Press, National Academic Press,
          2003, <a target="_blank" style={{color: "#a3a190"}} href={links[0]['url']}>{links[0]['url']}</a>. Accessed 27 June 2024.
          </p>
          <p className="resources">
          Rad, Dana, et al. “Neural Network Applications in Polygraph Scoring-a Scoping Review.”
          MDPI, Multidisciplinary Digital Publishing Institute, 13 Oct. 2023, 
          <a target="_blank" style={{color: "#a3a190"}} href={links[1]['url']}>{links[1]['url']}</a>. Accessed 27 June 2024.
          </p>
          <p className="resources">
          Talaat, Fatma M. “Explainable Enhanced Recurrent Neural Network for Lie Detection Using 
          Voice Stress Analysis - Multimedia Tools and Applications.” SpringerLink, Springer US, 
          20 Sept. 2023, <a target="_blank" style={{color: "#a3a190"}} href={links[2]['url']}>{links[2]['url']}</a>. Accessed 27 June 2024.
          </p>
          <p className="resources">
          Sun, Z Y, et al. “Polygraph Accuracy of Control Question Test in Criminal Cases.” 
          Polygraph Accuracy of Control Question Test in Criminal Cases, U.S. National Library of 
          Medicine, 25 June 2019, <a target="_blank" style={{color: "#a3a190"}} href={links[3]['url']}>{links[3]['url']}</a>. Accessed 27 June 2024.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Resources;
