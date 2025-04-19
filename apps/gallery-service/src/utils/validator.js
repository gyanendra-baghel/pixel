import { body, validationResult } from 'express-validator';

export const validateCreateGallery = [
  body('name')
    .notEmpty()
    .withMessage('Gallery name is required')
    .isLength({ min: 3 })
    .withMessage('Gallery name must be at least 3 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateSubmitImage = [
  body('galleryId')
    .notEmpty()
    .withMessage('Gallery ID is required')
    .isInt()
    .withMessage('Gallery ID must be an integer'),

  body('storagePath')
    .notEmpty()
    .withMessage('Storage path is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateGrantAccess = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),

  body('galleryId')
    .notEmpty()
    .withMessage('Gallery ID is required')
    .isInt()
    .withMessage('Gallery ID must be an integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
