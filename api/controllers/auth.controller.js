import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

// Test route to check if the API is working
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

// Sign up a new user
export const signup = async (req, res, next) => {
  const { username, email, password, userType } = req.body;

  if (!username || !email || !password || !userType) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    userType, // Now taking userType into account
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

// Sign in a user
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const token = jwt.sign(
      { id: validUser._id, userType: validUser.userType }, // Use userType here
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google authentication logic (if needed)
export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl, userType } = req.body;

  try {
    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, generate a JWT token and return user data (sign-in)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json({
          ...rest,
          message: 'Signed in successfully',  // Add sign-in message
        });
    }

    // If user doesn't exist, proceed with sign-up
    // Validate userType or fallback to 'public'
    const validUserTypes = ['user', 'public'];
    const finalUserType = validUserTypes.includes(userType) ? userType : 'public';

    // Generate a random password for the new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    // Create a new user in the database
    const newUser = new User({
      username: name.toLowerCase().replace(/\s+/g, '') + Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
      userType: finalUserType,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    // Send token in a cookie and return user info (excluding password)
    return res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json({
        ...rest,
        message: 'Signed up successfully',  // Add sign-up message
      });
  } catch (error) {
    next(error);
  }
};





// Sign out a user (clear cookies)
export const signout = (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully signed out' });
};
