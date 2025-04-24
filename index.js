// index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const Tool     = require('./models/Tool');

const app = express();

// 1️⃣ CORS setup
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));  // apply before your routes
app.options('*', cors(corsOptions)); // enable pre-flight for all routes

app.use(express.json());

// 2️⃣ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:   true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// 3️⃣ CRUD routes

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

// 4️⃣ Serve React build & static assets
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 5️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ToolHub API server running on port ${PORT}`);
});
