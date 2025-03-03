import AppError from '../utils/AppError.js';

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(400, `Données invalides: ${errors.join('. ')}`);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.sqlMessage.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(400, `La valeur ${value} existe déjà`);
};

const handleJWTError = () => new AppError(401, 'Token invalide');
const handleJWTExpiredError = () => new AppError(401, 'Token expiré');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue'
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'SequelizeValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};