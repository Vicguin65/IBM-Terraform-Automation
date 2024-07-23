import React, { useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import './App.css'; // Import your main CSS file
import './styles.css'; // Import additional CSS file
import DataAnalytics from './DataAnalytics'; // Import DataAnalytics component
import Chatbot from './Chatbot'; // Import Chatbot component
import About from './About';
import Resources from './Resources';

const poolData = {
  UserPoolId: process.env.USERPOOLID, // Placeholder for user pool id
  ClientId: process.env.CLIENTID       // Placeholder for client id
};

const userPool = new CognitoUserPool(poolData);

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
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [message, setMessage] = useState(''); // State for message
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and registration

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLogin) {
      // Login logic
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          setMessage(`Login successful! Welcome, ${result.getIdToken().payload.email}`);
        },
        onFailure: (err) => {
          setMessage(`Login failed: ${err.message}`);
        }
      });
    } else {
      // Registration logic
      const attributeList = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          setMessage(`Registration failed: ${err.message}`);
          return;
        }
        setMessage(`Registration successful! Please check your email to confirm your account.`);
        setIsLogin(true); // Switch to login form after successful registration
      });
    }

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' && <HeroSection />}
      {activeTab === 'data-analytics' && <DataAnalytics />}
      {activeTab === 'about' && <About />}
      {activeTab === 'resources' && <Resources />}
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
