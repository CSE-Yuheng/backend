// index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const Tool     = require('./models/Tool');   // ①

const app = express();
app.use(cors());
app.use(express.json());

// ② Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:   true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ---- CRUD Endpoints using Mongoose ----

// GET all tools
app.get('/api/tools', async (req, res) => {
  const tools = await Tool.find().sort('_id');
  res.json(tools);
});

// POST add new tool
app.post('/api/tools', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newTool = new Tool(value);
  await newTool.save();
  res.status(201).json({ message: 'Tool added successfully', tool: newTool });
});

// PUT update tool
app.put('/api/tools/:id', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const updated = await Tool.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!updated) return res.status(404).json({ error: 'Tool not found' });

  res.json({ message: 'Tool updated successfully', tool: updated });
});

// DELETE remove tool
app.delete('/api/tools/:id', async (req, res) => {
  const deleted = await Tool.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Tool not found' });
  res.sendStatus(200);
});

// Serve your React build and public assets
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ToolHub API server running on port ${PORT}`);
});

