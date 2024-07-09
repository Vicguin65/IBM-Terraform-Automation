// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/respond', (req, res) => {
  const userMessage = req.body.message;
  // Implement logic to generate a response
  const botResponse = `You said: ${userMessage}`;
  res.json({ response: botResponse });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
