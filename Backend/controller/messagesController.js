const messageModel = require('../model/messageModel');

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = new messageModel({
            message: { text: message },
            users: [from, to],
            sender: from
        });
        await data.save();
        if (data) {
            res.send({ msg: "Message added successfully" });
        } else {
            res.send({ msg: "Failed to add message to the database" });
        }
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectMessages = messages.map((msg) => {
            return {
                fromself: msg.sender.toString() === from,
                message: msg.message.text,
            }
        });

        res.send(projectMessages);
    } catch (e) {
        next(e);
    }
};
