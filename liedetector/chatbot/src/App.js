import React from 'react';
import Chatbot from './Chatbot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Your Website</h1>
      </header>
      <section id="home" className="hero">
        <div className="container">
          <img src="AdobeStock_290225771.jpeg" alt="Description of your image" style={{ maxWidth: '100%', display: 'block', margin: '0 auto 20px' }} />
          <h2 className="hero-title">Can Polygraph Tests Effectively Discern Deceit in Criminal Cases?</h2>
        </div>
      </section>
      <Chatbot />
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;


