import express from 'express';
import { check } from 'express-validator';
import { 
  getAllData, 
  getSingleData, 
  createData, 
  updateData, 
  deleteData 
} from '../Controllers/index.js';
import auth from '../middleware/auth.js'; // Authentication middleware

const router = express.Router();

// Define validation arrays
const createValidations = [
  check('logType', 'Log type is required')
    .isIn(['water', 'plastic']),
  check('data.amount', 'Amount must be a positive number')
    .isFloat({ min: 0 }),
  check('data.unit', 'Invalid unit')
    .optional()
    .isIn(['ml', 'oz', 'L', 'gal'])
];

// Update validation arrays
const updateValidations = [
  check('data.amount', 'Amount must be a positive number')
    .optional()
    .isFloat({ min: 0 })
];

/**
 * @desc    Get all water/plastic tracking entries
 * @route   GET /api/data
 * @access  Private (Authenticated users only)
 * @query   type?=water|plastic (Filter by log type)
 */
router.get('/data', auth, getAllData);

/**
 * @desc    Get single tracking entry
 * @route   GET /api/data/:id
 * @access  Private (Owner/Admin only)
 */
router.get('/data/:id', auth, getSingleData);

/**
 * @desc    Create new tracking entry
 * @route   POST /api/data
 * @access  Private (Authenticated users)
 * @body    { 
 *            logType: "water"|"plastic",
 *            data: {
 *              amount: Number,
 *              unit?: "ml"|"oz",
 *              notes?: String 
 *            }
 *          }
 */
router.post('/data', auth, createData);

/**
 * @desc    Update tracking entry
 * @route   PUT /api/data/:id
 * @access  Private (Owner/Admin only)
 * @body    { data: Object }
 */
router.put('/data/:id', updateData);

/**
 * @desc    Delete tracking entry
 * @route   DELETE /api/data/:id
 * @access  Private (Owner/Admin only)
 */
router.delete('/data/:id', auth, deleteData);

export default router;
