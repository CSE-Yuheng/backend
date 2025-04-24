// index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const Tool     = require('./models/Tool');

const app = express();

// ─── 1) ENABLE CORS ────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://cse-yuheng.github.io'
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── 2) PARSE JSON BODIES ───────────────────────────────────────────────────────
app.use(express.json());

// ─── 3) CONNECT TO MONGODB ────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:   true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── 4) CRUD ROUTES ─────────────────────────────────────────────────────────────

// GET all tools
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await Tool.find().sort('_id');
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add new tool
app.post('/api/tools', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newTool = new Tool(value);
    await newTool.save();
    res.status(201).json({ message: 'Tool added successfully', tool: newTool });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update existing tool
app.put('/api/tools/:id', async (req, res) => {
  const { error, value } = Tool.validateTool(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updated = await Tool.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ error: 'Tool not found' });
    res.json({ message: 'Tool updated successfully', tool: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE remove tool
app.delete('/api/tools/:id', async (req, res) => {
  try {
    const deleted = await Tool.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Tool not found' });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── 5) SERVE FRONT-END ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ─── 6) START SERVER ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
