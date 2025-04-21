import Pin from '../models/pin.model.js';
import { errorHandler } from '../utils/error.js';

//Test
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

//Create Pin
export const createPin = async (req, res, next) => {
  try {
    const pin = await Pin.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(pin);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

// Delete Pin
export const deletePin = async (req, res, next) => {
    try {
      const pin = await Pin.findById(req.params.id);
  
      if (!pin) {
        return next(errorHandler(404, 'Pin not found'));
      }
  
      // Check if the requesting user is the creator or an admin
      if (pin.createdBy.toString() !== req.user.id && req.user.userType !== 'admin') {
        return next(errorHandler(403, 'You are not authorized to delete this pin'));
      }
  
      await Pin.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Pin successfully deleted' });
    } catch (err) {
      next(errorHandler(500, err.message));
    }
  };
  

//Get Pins
export const getPins = async (req, res, next) => {
  try {
    const pins = await Pin.find().populate('createdBy', 'username userType');
    res.status(200).json(pins);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

//Update Pin Status
export const updatePinStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const pin = await Pin.findById(req.params.id);
    if (!pin) return next(errorHandler(404, 'Pin not found'));

    pin.location.status = status;
    await pin.save();
    res.status(200).json(pin);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};