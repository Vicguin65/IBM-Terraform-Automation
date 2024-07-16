import React, { Component } from 'react';
import './Chatbot.css';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isOpen: false // Track whether the chatbot is open or closed
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

      // Simulate bot response
      setTimeout(() => {
        const botResponse = "This is a bot response.";
        this.addMessage(botResponse, "bot");
      }, 1000);
    }
  };

  toggleChatbot = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
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
    const { messages, isOpen } = this.state;

    return (
      <div className={`chatbot ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-content">
          <div className="chatbot-header" onClick={this.toggleChatbot}>
            Chatbot
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
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
      </div>
    );
  }
}

export default Chatbot;





  