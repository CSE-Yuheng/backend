// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Travel blog posts data (reuse same data structure)
const posts = [
  {
    id: 1,
    title: "Exploring the Alps",
    description: "Experience the breathtaking views and alpine culture of the Swiss Alps.",
    image: "/images/alps.jpg"  // if you plan to serve these images from the server, see below
  },
  {
    id: 2,
    title: "Beach Paradise in Bali",
    description: "Discover the tranquil beaches, crystal-clear waters, and vibrant sunsets in Bali.",
    image: "/images/bali.jpg"
  },
  {
    id: 3,
    title: "Safari in Serengeti",
    description: "Join us on a safari through the Serengeti National Park and witness magnificent wildlife.",
    image: "/images/safari.jpg"
  }
];

// Serve API endpoint to return posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Serve static images (if you decide to host images here)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve the documentation page from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for index.html in case of deep linking
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Travel Blog API server running on port ${PORT}`);
});
