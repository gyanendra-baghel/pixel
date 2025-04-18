
const errorMiddleware = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  console.error('🔥 Error:', err); // Log the full error

  // Zod validation error
  if (err.name == "ZodError") {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
      ...(isDev && { stack: err.stack }),
    });
  }

  // Default fallback
  return res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    ...(isDev && { stack: err.stack }),
  });
};

export default errorMiddleware;
