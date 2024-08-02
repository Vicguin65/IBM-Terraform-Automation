import React, { useState } from 'react';
import './App.css'; // Import your main CSS file
import './styles.css'; // Import additional CSS file
import DataAnalytics from './DataAnalytics'; // Import DataAnalytics component
import Chatbot from './Chatbot'; // Import Chatbot component
import About from './About';
import Resources from './Resources';
import MeetTheTeam from './MeetTheTeam'; // Import MeetTheTeam component

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
          <li><a href="#" className={activeTab === 'meet-the-team' ? 'active' : ''} onClick={() => setActiveTab('meet-the-team')}>Meet the Team</a></li>
        </ul>
      </div>
    </nav>
  </header>
);

const HeroSection = () => (
  <section id="home" className="hero">
    <div className="container">
      <h2 className="hero-title">Can Polygraph Tests Effectively Discern Deceit in Criminal Cases?</h2>
      <img src={require("./assets/AdobeStock_290225771.jpeg")} alt="Description of your image" 
      style={{ maxWidth: '100%', display: 'block', margin: '0 auto 20px' }} />
      <p style={{ textAlign: 'left' }}>
        Lie detectors, or polygraph tests, measure physiological responses such as heart rate, blood pressure, respiration, and skin conductivity to determine whether a person is being truthful. The underlying assumption is that deceptive answers will produce physiological responses that differ from those associated with truthful answers. While polygraph tests can indicate stress or nervousness, which may be associated with lying, they are not foolproof and can be influenced by various factors such as anxiety, medical conditions, or the subject's ability to control their physiological responses. Polygraph accuracy is a subject of debate. Some studies suggest they are highly accurate, while others argue they have significant limitations and potential for false positives and negatives. Due to these limitations, polygraph results are not universally admissible in court and are often used in conjunction with other investigative techniques. Advances in technology and methodology aim to improve the reliability of lie detection, but the current consensus is that while polygraphs can provide useful information, they are not definitive proof of deception.
      </p>
    </div>
  </section>
);

// Footer component with conditional rendering based on activeTab
const Footer = ({ activeTab }) => (
  <footer className={`footer ${activeTab === 'data-analytics' ? 'hidden' : ''}`}>
    <div className="container">
      <p>&copy; 2024 RPI Cloud Coders. All rights reserved.</p>
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
      {activeTab === 'home' && <HeroSection />}
      {activeTab === 'data-analytics' && <DataAnalytics />}
      {activeTab === 'about' && <About />}
      {activeTab === 'resources' && <Resources />}
      {activeTab === 'meet-the-team' && <MeetTheTeam />}
      <Footer activeTab={activeTab} />
      <>
          <button className="chatbot-toggle-button" onClick={toggleChatbot}>
            {isChatbotOpen ? 'Close Chatbot' : 'Open Chatbot'}
          </button>
          <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
       </>
    </div>
  );
};

export default App;
