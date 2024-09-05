const Group = require('../models/Group');
const Message = require('../models/Message');

exports.createGroup = async (req, res) => {
    const { name } = req.body;
    if(!name || Group.findOne({name: name})){
        return ;
    }
    const group = new Group({ name });
    await group.save();
    res.status(201).json(group);
};

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.json({ message: 'Group deleted' });
};

exports.addMember = async (req, res) => {
    const { groupId, userId } = req.body;
    if(!groupId || !userId){
        return res.status(400);
    }
    const group = await Group.findById(groupId);
    if(group && group.members.findIndex(userId => userId == userId) == -1){
        group.members.push(userId);
        await group.save();
        res.json(group);
    }
    else
    res.json(group.members.findIndex(userId => userId == userId) > -1 ? group.members : 401);
};

exports.sendMessage = async (req, res) => {
    const { groupId, senderId, content } = req.body;
    const message = new Message({ group: groupId, sender: senderId, content });
    await message.save();
    res.status(201).json(message);
};

exports.likeMessage = async (req, res) => {
    const { messageId, userId } = req.body;
    const message = await Message.findById(messageId);
    message.likes.push(userId);
    await message.save();
    res.json(message);
};
