// index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const Tool     = require('./models/Tool');

const app = express();

// ─── 1) ENABLE CORS ────────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
};
app.use(cors(corsOptions));
// (optional) handle pre‐flight for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// ─── 2) CONNECT TO MONGODB ────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── 3) YOUR CRUD ROUTES ──────────────────────────────────────────────────────
app.get('/api/tools',    /* … */);
app.post('/api/tools',   /* … */);
app.put('/api/tools/:id',/* … */);
app.delete('/api/tools/:id', /* … */);

// ─── 4) SERVE FRONT-END ───────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ─── 5) START SERVER ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
