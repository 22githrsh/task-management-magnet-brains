const User = require('../models/User');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Controller for user registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const doesPassMatch = await bcrypt.compare(password, user.password)
    
    if (!doesPassMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, "secret")
    res.cookie("jwt_token", token)
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  }
};


module.exports = {
  registerUser,
  loginUser,
};
