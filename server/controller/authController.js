import User from '../models/Users.js';


const handleSignup = async (req, res) => {
  const { name, email, loginMethod } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        message: 'User already exists',
        name: existingUser.name,
        email: existingUser.email,
      });
    }

    const newUser = new User({
      name,
      email,
      authProvider: loginMethod || 'email',
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User created',
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};



const handleLogin = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login. User not found.' });
    }

    return res.status(200).json({
      message: 'Login successful',
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export { handleSignup, handleLogin };
