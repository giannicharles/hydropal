// Import Mongoose library for MongoDB object modeling
import mongoose from 'mongoose';

/**
 * Data Schema Definition
 * Enhanced with validation and documentation for water/plastic tracking
 * 
 * @typedef {Object} DataSchema
 * @property {Object} data - The tracking payload (required)
 * @property {Date} createdAt - Auto-generated timestamp
 * @property {Date} updatedAt - Auto-updating timestamp
 */
const DataSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
      required: [true, 'Data payload is required'], // Enhanced validation message
      validate: {
        validator: (value) => Object.keys(value).length > 0,
        message: 'Data object cannot be empty'
      }
    },
    // Additional useful fields for tracking systems:
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Improves query performance for user-specific data
    },
    logType: {
      type: String,
      enum: ['water', 'plastic'], // Restrict to specific log types
      required: true
    }
  },
  {
    // Automatic timestamps for tracking creation/modification times
    timestamps: true,
    
    // Enable Mongoose strict mode (prevents undefined fields)
    strict: true,
    
    // Optimize for console.log readability
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

// Add text index for search functionality (optional)
DataSchema.index({ 'data.notes': 'text' });

// Export the model using modern syntax
export default mongoose.model('Data', DataSchema);
