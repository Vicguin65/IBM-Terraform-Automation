import React, { useState } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    // Simulate a response (replace with actual chatbot logic)
    const botResponse = "This is a simulated response.";

    setMessages([...messages, { text: message, sender: 'user' }]);
    setTimeout(() => {
      setMessages([...messages, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div id="chatbot-root" style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px', maxWidth: '100%', height: '400px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="chatbot-header" style={{ backgroundColor: '#333', color: '#fff', padding: '10px', textAlign: 'center' }}>Chatbot</div>
      <div className="chatbot-messages" style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.sender}`} style={{ marginBottom: '10px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.text}</div>
        ))}
      </div>
      <div className="chatbot-input" style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
        <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '0', outline: 'none' }} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e.target.value)} />
        <button style={{ padding: '10px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={() => handleSendMessage(document.querySelector('.chatbot-input input').value)}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
