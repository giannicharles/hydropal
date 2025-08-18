import mongoose from 'mongoose';
import User from '../models/User.js';
import Data from '../models/Data.js'; // Import Data model for tracking water usage and rank
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // More specific error messages
    let errorMessage = 'Failed to register user';
    if (err.name === 'ValidationError') {
      errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
    } else if (err.code === 11000) {
      errorMessage = 'Email is already registered';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate user'
    });
  }
};

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

// Water Log Controller Functions
// ===================================

/**
 * @desc    Create water log entry
 * @route   POST /api/auth/water
 * @access  Private
 */
export const logWater = async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount)) {
    return res.status(400).json({
      success: false,
      message: 'Valid water amount is required'
    });
  }

  try {
    const waterLog = await Data.create({
      userId: req.user.id,
      amount: Number(amount)
    });

    res.status(201).json({
      success: true,
      data: waterLog
    });
  } catch (err) {
    console.error('Water log error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to log water intake'
    });
  }
};

/**
 * @desc    Get today's water intake
 * @route   GET /api/auth/water/today
 * @access  Private
 */
export const getTodayWater = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await Data.find({
      userId: req.user.id,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const total = logs.reduce((sum, log) => sum + log.amount, 0);
    
    res.json({
      success: true,
      total
    });
  } catch (err) {
    console.error('Today water error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s water intake'
    });
  }
};

/**
 * @desc    Clear today's water logs
 * @route   DELETE /api/auth/water/today
 * @access  Private
 */
export const clearTodayWater = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Delete all water logs for the user today
    const result = await Data.deleteMany({
      userId: req.user.id,
      logType: 'water',
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} water logs`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Clear today water error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to clear today\'s water logs'
    });
  }
};

/**
 * @desc    Get water ranking
 * @route   GET /api/auth/water/ranking
 * @access  Private
 */
export const getWaterRanking = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate to get user rankings
    const ranking = await Data.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          totalAmount: 1
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: ranking
    });
  } catch (err) {
    console.error('Ranking error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch water ranking'
    });
  }
};

/**
 * @desc    Get monthly water data
 * @route   GET /api/auth/water/monthly
 * @access  Private
 */
export const getMonthlyWater = async (req, res) => {
  try {
    // Get current year
    const now = new Date();
    const year = now.getFullYear();
    
    // Get monthly totals for the current year
    const monthlyData = await Data.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          createdAt: {
            $gte: new Date(year, 0, 1), // Jan 1
            $lte: new Date(year, 11, 31) // Dec 31
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1
        }
      }
    ]);

    // Create array with 12 months, fill missing months with 0
    const filledData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const entry = monthlyData.find(d => d.month === month);
      return entry ? entry.totalAmount : 0;
    });

    res.json({
      success: true,
      data: filledData
    });
  } catch (err) {
    console.error('Monthly water error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly water data'
    });
  }
};