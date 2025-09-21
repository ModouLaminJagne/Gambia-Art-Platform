const Joi = require('joi');

// Artist registration validation
const validateArtistRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
      }),
    surname: Joi.string()
      .min(2)
      .max(50)
      .trim()
      .required()
      .messages({
        'string.min': 'Surname must be at least 2 characters long',
        'string.max': 'Surname cannot exceed 50 characters',
        'any.required': 'Surname is required'
      }),
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),
    address: Joi.string()
      .min(5)
      .max(200)
      .trim()
      .required()
      .messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address cannot exceed 200 characters',
        'any.required': 'Address is required'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }

  next();
};

// Artist login validation
const validateArtistLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }

  next();
};

// Artwork validation
const validateArtwork = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .min(10)
      .max(500)
      .trim()
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required'
      }),
    copiesAvailable: Joi.number()
      .integer()
      .min(0)
      .max(1000)
      .required()
      .messages({
        'number.min': 'Copies available cannot be negative',
        'number.max': 'Copies available cannot exceed 1000',
        'any.required': 'Copies available is required'
      }),
    tags: Joi.array()
      .items(Joi.string().trim().max(20))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Cannot have more than 10 tags',
        'string.max': 'Each tag cannot exceed 20 characters'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }

  next();
};

// Search query validation
const validateSearchQuery = (req, res, next) => {
  const schema = Joi.object({
    q: Joi.string().trim().max(100).optional(),
    artist: Joi.string().trim().max(50).optional(),
    tags: Joi.string().trim().max(100).optional(),
    sort: Joi.string().valid('newest', 'oldest', 'popular', 'title').optional(),
    page: Joi.number().integer().min(1).max(100).optional(),
    limit: Joi.number().integer().min(1).max(50).optional()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      error: 'Invalid search parameters',
      details: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }

  next();
};

module.exports = {
  validateArtistRegistration,
  validateArtistLogin,
  validateArtwork,
  validateSearchQuery
};
