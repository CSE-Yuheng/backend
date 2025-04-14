const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Load existing tools from tools.json
const toolsFilePath = path.join(__dirname, 'public', 'tools.json');
let tools = [];

fs.readFile(toolsFilePath, 'utf8', (err, data) => {
  if (!err) {
    try {
      tools = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing tools.json:', parseErr);
    }
  }
});

// Joi schema for tool validation
const toolSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
  brand: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  img_name: Joi.string().required()
});

// GET endpoint to retrieve tools
app.get('/api/tools', (req, res) => {
  res.json(tools);
});

// POST endpoint to add a new tool
app.post('/api/tools', (req, res) => {
  const { error, value } = toolSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newTool = {
    _id: tools.length ? tools[tools.length - 1]._id + 1 : 1,
    ...value
  };
  tools.push(newTool);

  // Optionally, write the updated tools array back to tools.json
  fs.writeFile(toolsFilePath, JSON.stringify(tools, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Error writing to tools.json:', writeErr);
    }
  });

  res.status(201).json({ message: 'Tool added successfully', tool: newTool });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ToolHub API server running on port ${PORT}`);
});

