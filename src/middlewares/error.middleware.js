const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid note ID',
      data: null
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: message,
      data: null
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    data: null
  });
};

module.exports = errorHandler;
