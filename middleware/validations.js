const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/error');

// Validation and sanitization middleware for searchProduct
exports.validateSearchProduct = [
    body('searchItem')
        .trim()
        .escape()
        .notEmpty().withMessage('Search item is required')
        .isLength({ max: 100 }).withMessage('Search item too long'),
    (req, res, next) => {
        const errors = validationResult(req);
        // If there are validation errors, return the first error
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()[0].msg);
            return next(new ErrorResponse(errors.array()[0].msg, 400));
        }
        next();
    }
];