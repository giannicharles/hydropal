import Data from '../Models/Data.js';
import { validationResult } from 'express-validator'; // For request validation

/**
 * @desc    Get all water/plastic tracking entries
 * @route   GET /api/data
 * @access  Authenticated users
 */
export const getAllData = async (req, res) => {
  try {
    // Add filtering for water/plastic logs
    const filter = {};
    if (req.query.type) filter.logType = req.query.type; // ?type=water
    if (req.user) filter.userId = req.user.id; // Only show current user's data

    const data = await Data.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Faster processing

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    console.error('Error fetching tracking data:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Get single tracking entry
 * @route   GET /api/data/:id
 * @access  Owner/Admin
 */
export const getSingleData = async (req, res) => {
  try {
    const entry = await Data.findOne({
      _id: req.params.id,
      ...(req.user.role !== 'admin' && { userId: req.user.id }) // Restrict to owner unless admin
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'No tracking entry found'
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking entry'
    });
  }
};

/**
 * @desc    Create new water/plastic tracking entry
 * @route   POST /api/data
 * @access  Authenticated users
 */
export const createData = async (req, res) => {
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const newEntry = await Data.create({
      ...req.body,
      userId: req.user.id // Automatically assign to current user
    });

    res.status(201).json({
      success: true,
      message: 'Tracking entry created',
      data: {
        id: newEntry._id,
        type: newEntry.logType,
        amount: newEntry.data.amount,
        date: newEntry.createdAt
      }
    });
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create tracking entry'
    });
  }
};

/**
 * @desc    Update tracking entry
 * @route   PUT /api/data/:id
 * @access  Owner/Admin
 */
export const updateData = async (req, res) => {
  try {
    const updatedEntry = await Data.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id // Only owner can update
      },
      { data: req.body.data },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'No tracking entry found or not authorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tracking entry updated',
      data: updatedEntry
    });
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update tracking entry'
    });
  }
};

/**
 * @desc    Delete tracking entry
 * @route   DELETE /api/data/:id
 * @access  Owner/Admin
 */
export const deleteData = async (req, res) => {
  try {
    const deletedEntry = await Data.findOneAndDelete({
      _id: req.params.id,
      ...(req.user.role !== 'admin' && { userId: req.user.id }) // Restrict to owner unless admin
    });

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'No tracking entry found or not authorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tracking entry deleted',
      data: { id: req.params.id }
    });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tracking entry'
    });
  }
};