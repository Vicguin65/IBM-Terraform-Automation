import React, { useState } from 'react';
import './styles.css';
import DataAnalytics from './DataAnalytics';
import Chatbot from './Chatbot';
import About from './About';
import Resources from './Resources';
import MeetTheTeam from './MeetTheTeam';

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
      <div className="hero-content">
        <img src={require("./assets/poly.jpg")} alt="Description of your image" className="hero-image" />
        <div className="hero-text">
          <p>
            Lie detectors, or polygraph tests, measure physiological responses like heart rate and blood pressure to assess truthfulness. They are based on the idea that deceptive answers trigger different physiological reactions compared to truthful ones. However, polygraphs are not infallible; they can be influenced by factors such as anxiety, medical conditions, or the subject's control over their responses. The accuracy of polygraphs is debated, with some studies indicating high reliability and others pointing out significant limitations and risks of false positives or negatives. Due to these issues, polygraph results are not universally accepted in court and are often used alongside other investigative methods. While technological advancements aim to enhance their reliability, polygraphs remain an imperfect tool for detecting deception.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ activeTab }) => (
  <footer className={`footer ${activeTab === 'data-analytics' ? 'hidden' : ''}`}>
    <div className="container">
      <p>&copy; 2024 RPI Cloud Coders. All rights reserved.</p>
    </div>
  </footer>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
        <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} activeTab={activeTab} />
      </>
    </div>
  );
};

export default App;
