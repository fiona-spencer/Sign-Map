import Pin from '../models/pin.model.js';
import { errorHandler } from '../utils/error.js';

//Test
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

//Create pin
export const createPin = async (req, res, next) => {
  try {
    const { location, createdBy } = req.body; // Destructure location and createdBy from body
    const pin = await Pin.create({
      location,
      createdBy: req.user.id, // Attach the authenticated user
    });

    res.status(201).json(pin);
  } catch (err) {
    next(errorHandler(500, err.message)); // Error handling
  }
};

// Delete Pin
export const deletePin = async (req, res, next) => {
  try {
    const pin = await Pin.findById(req.params.id); // Find pin by ID

    if (!pin) {
      return next(errorHandler(404, 'Pin not found'));
    }

    // Check if the requesting user is the creator or an admin
    if (pin.createdBy.toString() !== req.user.id && req.user.userType !== 'admin') {
      return next(errorHandler(403, 'You are not authorized to delete this pin'));
    }

    await Pin.findByIdAndDelete(req.params.id); // Delete the pin
    res.status(200).json({ message: 'Pin successfully deleted' });
  } catch (err) {
    next(errorHandler(500, err.message)); // Error handling
  }
};

  

// Get Pins
export const getPins = async (req, res, next) => {
  try {
    const pins = await Pin.find().populate('createdBy', 'username userType'); // Populate user details
    res.status(200).json(pins); // Return the list of pins
  } catch (err) {
    next(errorHandler(500, err.message)); // Error handling
  }
};


// Update Pin Status
export const updatePinStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // Get the new status from the request body
    const pin = await Pin.findById(req.params.id); // Find the pin by ID
    if (!pin) return next(errorHandler(404, 'Pin not found')); // If pin not found, throw error

    pin.location.status = status; // Update the pin's status
    await pin.save(); // Save the updated pin
    res.status(200).json(pin); // Return the updated pin
  } catch (err) {
    next(errorHandler(500, err.message)); // Error handling
  }
};
