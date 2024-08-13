const UserModel = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await UserModel.findOne({ username });
        if (usernameCheck)
            return res.send({ message: 'Username already exists', status: false });
        const emailCheck = await UserModel.findOne({ email });
        if (emailCheck)
            return res.send({ message: 'Email already exists', status: false });
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, 10);
        const data = new UserModel({
            username,
            email,
            password: hashPassword
        });
        await data.save();
        delete data.password;
        res.send({ status: true, user: data });
    }
    catch (e) {
        next(e);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (!user)
            return res.send({ message: 'Incorrect username', status: false });
        const authPassword = await bcrypt.compare(password, user.password);
        if (!authPassword)
            return res.send({ message: 'Incorrect password', status: false });
        delete user.password;
        return res.send({ status: true, user });
    } catch (e) {
        next(e);
    }
}