// index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Tool     = require('./models/Tool');

const app = express();

// ─── 1) ENABLE CORS ────────────────────────────────────────────────────────────
// During dev this will let your React UI on localhost:3000 talk to this API.
// In production you can set CLIENT_ORIGIN to your real front-end URL.
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // handle preflight

// ─── 2) JSON PARSER ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── 3) CONNECT TO MONGODB ────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  // since v6 these options are defaults; you can omit them if you like
  useNewUrlParser:   true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── 4) CRUD ROUTES ─────────────────────────────────────────────────────────────

// GET /api/tools
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await Tool.find().sort('_id');
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tools
app.post('/api/tools', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const newTool = new Tool(value);
    await newTool.save();
    res.status(201).json({ tool: newTool });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tools/:id
app.put('/api/tools/:id', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const updated = await Tool.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ error: 'Tool not found' });
    res.json({ tool: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tools/:id
app.delete('/api/tools/:id', async (req, res) => {
  try {
    const deleted = await Tool.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Tool not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── 5) CATCH ALL UNKNOWN API ROUTES ────────────────────────────────────────────
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── 6) START SERVER ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔌 ToolHub API listening on port ${PORT}`);
});
