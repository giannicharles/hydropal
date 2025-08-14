import express from 'express';
import { check } from 'express-validator';
import { 
  register, 
  login, 
  getProfile,
  logWater,        
  getTodayWater,   
  getWaterRanking, 
  getMonthlyWater,
  clearTodayWater
} from '../controllers/Auth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidations = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

const loginValidations = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register', registerValidations, register);

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', loginValidations, login);

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
router.get('/profile', auth, getProfile);

// Water tracking routes
// ==========================
router.post('/water', auth, logWater);
router.get('/water/today', auth, getTodayWater);
router.delete('/water/today', auth, clearTodayWater);
router.get('/water/ranking', auth, getWaterRanking);
router.get('/water/monthly', auth, getMonthlyWater);

export default router;