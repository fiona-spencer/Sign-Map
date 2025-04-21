import mongoose from "mongoose";

// Define the Pin schema
const pinSchema = new mongoose.Schema({
  // Reference to the user who created this pin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true // Optional: set to true if always available
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    info: {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        default: 'default'
      },
      image: {
        type: String,
        default: 'https://example.com/default-image.jpg'
      }
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'resolved', 'deleted'],
      default: 'pending'
    }
  },
  phoneNumber: {
    type: String,
    required: false
  }
}, { timestamps: true });

// Create the Pin model
const Pin = mongoose.model('Pin', pinSchema);

export default Pin;
