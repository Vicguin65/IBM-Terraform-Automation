import React, { Component } from 'react';
import { WebChatContainer, setEnableDebug } from '@ibm-watson/assistant-web-chat-react';
import axios from 'axios';
import './Chatbot.css';

// Enable debug mode for Watson Assistant Web Chat
setEnableDebug(true);

const webChatOptions = {
  integrationID: 'YOUR_INTEGRATION_ID', // Replace with your integration ID
  region: 'us-east-2', // Replace with your region
  serviceInstanceID: 'YOUR_SERVICE_INSTANCE_ID', // Replace with your service instance ID
  // subscriptionID: 'only on enterprise plans',
};

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen, // Track whether the chatbot is open or closed
    };
    this.sessionId = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.setState({ isOpen: this.props.isOpen });
    }
  }

  async createSession() {
    try {
      const response = await axios.post(
        `https://api.${webChatOptions.region}.assistant.watson.cloud.ibm.com/instances/${webChatOptions.serviceInstanceID}/v2/assistants/YOUR_ASSISTANT_ID/sessions?version=2020-04-01`,
        {},
        {
          auth: {
            username: 'apikey',
            password: 'YOUR_API_KEY',
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
        `https://api.${webChatOptions.region}.assistant.watson.cloud.ibm.com/instances/${webChatOptions.serviceInstanceID}/v2/assistants/YOUR_ASSISTANT_ID/sessions/${this.sessionId}/message?version=2020-04-01`,
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
    const { isOpen } = this.state;

    return (
      <div className={`chatbot ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-content">
          <div className="chatbot-header" onClick={this.props.toggleChatbot}>
            Chatbot
          </div>
          {isOpen && (
            <WebChatContainer config={webChatOptions} />
          )}
        </div>
      </div>
    );
  }
}

export default Chatbot;
