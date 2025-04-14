// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Define the path to the tools JSON file (located in the public folder)
const toolsFilePath = path.join(__dirname, 'public', 'tools.json');

// API endpoint that reads and returns the tools data
app.get('/api/tools', (req, res) => {
  fs.readFile(toolsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading tools.json:', err);
      res.status(500).json({ error: 'Failed to read tools data.' });
    } else {
      try {
        const tools = JSON.parse(data);
        res.json(tools);
      } catch (parseError) {
        console.error('Error parsing tools.json:', parseError);
        res.status(500).json({ error: 'Failed to parse tools data.' });
      }
    }
  });
});

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route (serves index.html) for deep links
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ToolHub API server running on port ${PORT}`);
});

