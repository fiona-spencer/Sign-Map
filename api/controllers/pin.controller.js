import Pin from '../models/pin.model.js';
import { errorHandler } from '../utils/error.js';

//Test
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const createPin = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(errorHandler(401, 'Unauthorized'));
    }

    let pinsData = req.body;

    if (!Array.isArray(pinsData)) {
      pinsData = [pinsData]; // Normalize single pin input
    }

    const validatedPins = pinsData.map((item) => ({
      location: item.location,
      createdBy: userId,
    }));

    const createdPins = await Pin.insertMany(validatedPins, { ordered: false }); // continue on errors

    res.status(201).json({
      message: `${createdPins.length} pins created successfully.`,
      created: createdPins,
    });
  } catch (err) {
    console.error('Pin creation error:', err);

    // If insertMany fails partially
    if (err.name === 'BulkWriteError' || err.writeErrors) {
      return res.status(207).json({
        message: 'Some pins failed to create.',
        errorCount: err.writeErrors?.length || 0,
        errors: err.writeErrors?.map(e => e.errmsg || e.message),
      });
    }

    next(errorHandler(500, err.message));
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
