// index.js
const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // :contentReference[oaicite:0]{index=0}

const app = express();
app.use(cors());
app.use(express.json());

// Configure Multer to save uploads to public/images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name for uniqueness
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Load existing tools
const toolsFilePath = path.join(__dirname, 'public', 'tools.json');
let tools = [];
fs.readFile(toolsFilePath, 'utf8', (err, data) => {
  if (!err) {
    try { tools = JSON.parse(data); }
    catch (parseErr) { console.error('Error parsing tools.json:', parseErr); }
  }
});

// Joi schema
const toolSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
  brand: Joi.string().min(2).required(),
  description: Joi.string().min(5).required(),
  // img_name comes from the uploaded file
  img_name: Joi.string().required()
});

// GET all tools
app.get('/api/tools', (req, res) => res.json(tools));

// POST a new tool with image upload
app.post('/api/tools', upload.single('image'), (req, res) => {
  // Build form data object including filename
  const body = {
    ...req.body,
    img_name: 'images/' + req.file.filename
  };

  const { error, value } = toolSchema.validate(body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const newTool = { _id: tools.length ? tools[tools.length -1]._id +1 :1, ...value };
  tools.push(newTool);
  fs.writeFile(toolsFilePath, JSON.stringify(tools, null,2), err => {
    if (err) console.error('Write error:', err);
  });
  res.status(201).json({ message:'Tool added', tool:newTool });
});

// PUT and DELETE as before...
// (unchanged from your previous implementation)

// Serve static and fallback
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=>console.log(`API on port ${PORT}`));

