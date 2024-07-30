// Header.js

import React, { useState } from 'react';
import DataAnalytics from './DataAnalytics'; // Import DataAnalytics component

const Header = () => {
  const [showDataAnalytics, setShowDataAnalytics] = useState(false);

  const handleDataAnalyticsClick = () => {
    setShowDataAnalytics(true);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="container">
          <ul className="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><button onClick={handleDataAnalyticsClick}>Data & Analytics</button></li>
            <li><a href="about.html">About</a></li>
            <li><a href="resources.html">Resources</a></li>
          </ul>
        </div>
      </nav>
      {showDataAnalytics && <DataAnalytics />}
    </header>
  );
};

export default Header;