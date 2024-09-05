const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json(user);
};

exports.editUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
};
