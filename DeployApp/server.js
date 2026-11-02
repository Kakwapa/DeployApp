const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Keeping secrets out of the main code

const app = express();

// Basic middleware setup so the server can read JSON and serve frontend files
app.use(express.json()); 
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// Connecting to the database. I'm using an environment variable here for security.
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prda_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection failed:", err));

// Bringing in my route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));

