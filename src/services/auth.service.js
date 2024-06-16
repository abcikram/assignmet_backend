const createHttpError = require('http-errors')
const validator = require('validator');
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports.signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email }).lean();

    //check if user exist
    if (!user) throw createHttpError.NotFound("Invalid credentials.");

    //compare passwords with encrypted password
    let passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");

    return user;
};