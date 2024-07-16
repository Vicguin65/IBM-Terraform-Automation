import React, { Component } from 'react';
import { WebChatContainer, setEnableDebug } from '@ibm-watson/assistant-web-chat-react';
import './Chatbot.css';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isOpen: this.props.isOpen, // Track whether the chatbot is open or closed
    };
    this.sessionId = null;
  }

  componentDidMount() {
    this.createSession();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({ isOpen: this.props.isOpen });
    }
  }

  async createSession() {
    try {
      const response = await axios.post(
        'https://api.us-south.assistant.watson.cloud.ibm.com/instances/89dda75b-28ae-40eb-932e-35f4df82533f/v2/assistants/010a07ad-8998-4c57-ba89-2321aded77b6/sessions?version=2020-04-01',
        {},
        {
          auth: {
            username: 'apikey',
            password: 'rJrAULj6TzpYhJ8tRBGE6AkeEUxc1Y2edr-fbvhLdCz4',
          },
        }
      );
      this.sessionId = response.data.session_id;
      console.log('Session created:', this.sessionId);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  async sendMessageToWatson(text) {
    if (!this.sessionId) {
      await this.createSession();
    }

    try {
      const response = await axios.post(
        `https://api.us-south.assistant.watson.cloud.ibm.com/instances/YOUR_INSTANCE_ID/v2/assistants/YOUR_ASSISTANT_ID/sessions/${this.sessionId}/message?version=2020-04-01`,
        {
          input: {
            text: text,
          },
        },
        {
          auth: {
            username: 'apikey',
            password: 'YOUR_API_KEY',
          },
        }
      );

      console.log('Watson response:', response.data);
      if (response.data.output && response.data.output.generic && response.data.output.generic.length > 0) {
        const botResponse = response.data.output.generic[0].text;
        this.addMessage(botResponse, 'bot');
      } else {
        console.log('No response from Watson Assistant');
      }
    } catch (error) {
      console.error('Error sending message to Watson:', error);
    }
  }

  addMessage = (text, sender) => {
    const newMessage = { text, sender };
    this.setState((prevState) => ({
      messages: [...prevState.messages, newMessage],
    }));
  };

  handleUserInput = (userInput) => {
    if (userInput.trim() !== '') {
      this.addMessage(userInput, 'user');
      this.sendMessageToWatson(userInput);
    }
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const userInput = this.input.value;
    this.handleUserInput(userInput);
    this.input.value = '';
  };

  render() {
    const { messages, isOpen } = this.state;

    return (
      <div className={`chatbot ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-content">
          <div className="chatbot-header" onClick={this.props.toggleChatbot}>
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
              ref={(input) => (this.input = input)}
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
