const express = require('express');
const noteRoutes = require('./routes/note.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Fallback for route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
