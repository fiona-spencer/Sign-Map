import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';  // Adjust the path as needed
import { errorHandler } from '../utils/error.js';  // Adjust the path as needed

export const signup = async (req, res, next) => {
  const { username, email, password, userType } = req.body;

  // Ensure all required fields are provided
  if (
    !username ||
    !email ||
    !password ||
    !userType ||
    username === '' ||
    email === '' ||
    password === '' ||
    userType === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  // Validate userType to be one of 'public', 'user', or 'admin'
  const validUserTypes = ['public', 'user', 'admin'];
  if (!validUserTypes.includes(userType)) {
    return next(errorHandler(400, 'Invalid user type. It must be one of: public, user, or admin.'));
  }

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user object
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    userType,  // Add userType to the new user
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    next(error);  // Handle errors (e.g., database errors)
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Find the user by email
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    // Compare the provided password with the stored hashed password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // Create the JWT token, include userType along with id and isAdmin
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.userType === 'admin',  // Check if the userType is 'admin'
        userType: validUser.userType,  // Include the userType in the JWT payload
      },
      process.env.JWT_SECRET, // Use your JWT secret for signing the token
      { expiresIn: '1h' } // Optional: Set token expiration time (e.g., 1 hour)
    );

    // Destructure the user document to remove the password field
    const { password: pass, ...rest } = validUser._doc;

    // Send the token as a cookie and return the user data in the response
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,  // Prevent client-side access to the cookie
      })
      .json({
        ...rest,  // Send back the user details (without the password)
        token,  // Send the token along with the user data (optional)
      });

  } catch (error) {
    next(error);  // Handle any errors that occur during the process
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, userType } = req.body; // Now capturing userType from the request
  try {
    const user = await User.findOne({ email });
    
    if (user) {
      // If user exists, create a token with userType as it is
      const token = jwt.sign(
        { id: user._id, userType: user.userType }, // Pass the correct userType
        process.env.JWT_SECRET
      );

      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Create new user if not found
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Assign userType here from the request body (can be "user", "admin", etc.)
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        userType: userType || 'user', // Default to 'user' if no userType is provided
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          userType: newUser.userType, // Pass the correct userType here
          isAdmin: newUser.userType === 'admin', // Correctly set admin flag
        },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
