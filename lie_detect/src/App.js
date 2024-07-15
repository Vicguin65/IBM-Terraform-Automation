// App.js

import React, { useState } from 'react';
import './App.css'; // Import your main CSS file
import './styles.css'; // Import additional CSS file
import DataAnalytics from './DataAnalytics'; // Import DataAnalytics component

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
      <img src="AdobeStock_290225771.jpeg" alt="Description of your image" style={{ maxWidth: '100%', display: 'block', margin: '0 auto 20px' }} />
      <h2 className="hero-title">Can Polygraph Tests Effectively Discern Deceit in Criminal Cases?</h2>
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

// Chatbot component (unchanged)
class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  addMessage = (text, sender) => {
    const newMessage = { text, sender };
    this.setState(prevState => ({
      messages: [...prevState.messages, newMessage]
    }));
  };

  handleUserInput = userInput => {
    if (userInput.trim() !== "") {
      this.addMessage(userInput, "user");

      // Handle specific queries
      if (userInput.toLowerCase().includes("date")) {
        const today = new Date();
        const botResponse = today.toDateString();
        this.addMessage(botResponse, "bot");
      } else {
        // Example: Simulated API call
        setTimeout(() => {
          const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';

          fetch(API_URL)
            .then(response => response.json())
            .then(data => {
              const botResponse = data.title;
              this.addMessage(botResponse, "bot");
            })
            .catch(error => {
              console.error('Error fetching data:', error);
              const errorMessage = 'Error fetching data. Please try again.';
              this.addMessage(errorMessage, "bot");
            });
        }, 1000);
      }
    }
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const userInput = this.input.value;
    this.handleUserInput(userInput);
    this.input.value = "";
  };

  render() {
    return (
      <div id="chatbot-root">
        <div className="chatbot-header">Chatbot</div>
        <div className="chatbot-messages">
          {this.state.messages.map((message, index) => (
            <div key={index} className={`chatbot-message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type a message..."
            ref={input => (this.input = input)}
            onKeyPress={this.handleKeyPress}
          />
          <button onClick={this.handleSubmit}>Send</button>
        </div>
      </div>
    );
  }
}

// Main App component
const App = () => {
  const [activeTab, setActiveTab] = useState('home'); // State to manage active tab

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' && <HeroSection />}
      {activeTab === 'data-analytics' && <DataAnalytics />}
      <Chatbot />
      <Footer activeTab={activeTab} />
    </div>
  );
};

export default App;
