// Import Mongoose library for MongoDB object modeling
import mongoose from 'mongoose';

/**
 * Data Schema Definition for Water Tracking
 * 
 * @typedef {Object} DataSchema
 * @property {Number} amount - Water amount in milliliters (required)
 * @property {Date} createdAt - Auto-generated timestamp
 * @property {Date} updatedAt - Auto-updating timestamp
 * @property {ObjectId} userId - Reference to User model (required)
 * @property {String} logType - Type of log ('water')
 */
const DataSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Water amount is required'],
      min: [1, 'Amount must be at least 1 ml']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    logType: {
      type: String,
      enum: ['water'],
      default: 'water'
    }
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model('Data', DataSchema);
