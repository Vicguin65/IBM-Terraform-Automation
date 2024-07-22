import React, { useState } from 'react';
import './App.css'; // Import your main CSS file
import './styles.css'; // Import additional CSS file
import DataAnalytics from './DataAnalytics'; // Import DataAnalytics component
import Chatbot from './Chatbot'; // Import Chatbot component
import About from './About';
import Resources from './Resources';

// Header component with conditional rendering based on activeTab
const Header = ({ activeTab, setActiveTab }) => (
  <header className={`header ${activeTab === 'data-analytics' ? 'hidden' : ''}`}>
    <nav className="navbar">
      <div className="container">
        <ul className="nav-links">
          <li><a href="#" className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</a></li>
          <li><a href="#" className={activeTab === 'data-analytics' ? 'active' : ''} onClick={() => setActiveTab('data-analytics')}>Data & Analytics</a></li>
          <li><a href="#" className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About</a></li>
          <li><a href="#" className={activeTab === 'resources' ? 'active' : ''} onClick={() => setActiveTab('resources')}>Resources</a></li>
        </ul>
      </div>
    </nav>
  </header>
);

// Hero section component
const HeroSection = () => (
  <section id="home" className="hero">
    <div className="container">
      <h2 className="hero-title">Can Polygraph Tests Effectively Discern Deceit in Criminal Cases?</h2>
      <img src={require("./assets/AdobeStock_290225771.jpeg")} alt="Description of your image" 
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto 20px' }} />

    </div>
  </section>
);

// Footer component with conditional rendering based on activeTab
const Footer = ({ activeTab }) => (
  <footer className={`footer ${activeTab === 'data-analytics' ? 'hidden' : ''}`}>
    <div className="container">
      <p>&copy; 2024 Your Company Name. All rights reserved.</p>
    </div>
  </footer>
);

// Main App component
const App = () => {
  const [activeTab, setActiveTab] = useState('home'); // State to manage active tab
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State to manage chatbot visibility

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' && (
        <>
          <HeroSection />
          <button className="chatbot-toggle-button" onClick={toggleChatbot}>
            {isChatbotOpen ? 'Close Chatbot' : 'Open Chatbot'}
          </button>
          <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
        </>
      )}
      {activeTab === 'data-analytics' && <DataAnalytics />}
      {activeTab === 'about' && <About />}
      {activeTab === 'resources' && <Resources />}
      <Footer activeTab={activeTab} />
    </div>
  );
};

export default App;
