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
      required: true
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
      description: {
        type: String,
        required: false 
      },
      icon: {
        type: String,
        default: 'default'
      },
      image: {
        type: String,
        default: 'https://example.com/default-image.jpg'
      },
      populusId: {  // 👈 Newly added field
        type: String,
        required: false
      },
       // Contact person's name (added)
       contactName: {
        type: String,
        required: false
      },
      contactEmail: {
        type: String,
        required: true
      },
      contactPhoneNumber: {
        type: String,
        required: false
      },
      assigned: {
        type: String,
        required: false
      },
      // Contact person's name (added)
      fileName: {
        type: String,
        required: true,
      }
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'resolved', 'deleted'],
      default: 'pending'
    }
  }
}, { timestamps: true });

// Create the Pin model
const Pin = mongoose.model('Pin', pinSchema);

export default Pin;
