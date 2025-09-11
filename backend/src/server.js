const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/courses', coursesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Course Prerequisite Planner API ready!`);
});

module.exports = app; 