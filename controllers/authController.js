const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
exports.login = async (req, res) => {
    try{
      const { username, password } = req.body;
    if(!username || !password){
      return res.status(400).json({message:'Bad Request'});
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(404).json({ message: 'Not Found' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const tokenEntry = new Token({ userId: user._id, token });
    await tokenEntry.save();
    res.json({ token });
    }
    catch{
      return res.status(500);
    }
};

exports.logout = async(req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  console.log(token);
  try {
    await Token.findOneAndDelete({ token });
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
