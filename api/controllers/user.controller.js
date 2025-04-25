import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  // Authorization check to ensure the user is updating their own data or is an admin
  if (req.user.id !== req.params.userId && req.user.userType !== 'admin') {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  // Handle password validation and hashing if provided
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10); // Hash the password before saving
  }

  // Prepare the data to be updated
  const updatedData = {
    ...(req.body.username && { username: req.body.username }), // Only update if username is provided
    ...(req.body.email && { email: req.body.email }), // Only update if email is provided
    ...(req.body.profilePicture && { profilePicture: req.body.profilePicture }), // Only update if profile picture is provided
    ...(req.body.password && { password: req.body.password }), // Only update if password is provided
    ...(req.body.userType && { userType: req.body.userType }) // Only update if userType is provided
  };

  try {
    // Update the user in the database with the provided data
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: updatedData }, { new: true });
    
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Exclude password from the response to protect sensitive data
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const deleteUser = async (req, res, next) => {
  // Check if the user is not an admin or if they are not trying to delete their own account
  if (req.user.userType !== 'admin' && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  
  try {
    // Proceed to delete the user
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};


export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: true, // set to false if on localhost without HTTPS
        sameSite: 'None', // or 'Lax' depending on how the cookie was set
      })
      .status(200)
      .json({ message: 'User has been signed out' });
  } catch (error) {
    next(error);
  }
};


export const getUsers = async (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};