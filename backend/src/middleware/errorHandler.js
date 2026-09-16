/**
 * Standard Express error-handling middleware.
 * Must be registered last, after all routes.
 */
'use strict';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    error: err.publicMessage || err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = errorHandler;
