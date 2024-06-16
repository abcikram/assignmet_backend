const createHttpError = require('http-errors')
const validator = require('validator');
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports.createUser = async (userData) => {
    const { name, email, picture , password } = userData;

    if (!name || !email || !password) {
        throw createHttpError.BadRequest('Please fill in all the data');
    }

    if (!validator.isLength(name, { min: 2, max: 16 })) {
        throw createHttpError.BadRequest('Your name must be between 2 and 16 characters');
    }

    // email validation 
    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest('Invalid email address');
    }

    //check if user already exist
    const checkDb = await UserModel.findOne({ email });
    if (checkDb) {
        throw createHttpError.Conflict(
            "Please try again with a different email address, this email already exist."
        );
    }

    if (
        !validator.isLength(password, {
            min: 8,
            max: 20,
        })
    ) {
        throw createHttpError.BadRequest(
            "Please make sure your password is between 8 and 20 characters."
        );
    }

    //bcrypt the password
    const salt = await bcrypt.genSalt(10);
    const createPwd = await bcrypt.hash(password, salt);

    //adding user to databse
    const user = await new UserModel({
        name,
        email,
        picture: picture ,
        password: createPwd,
    }).save();

    return user;

}


module.exports.signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email }).lean();

    //check if user exist
    if (!user) throw createHttpError.NotFound("Invalid credentials.");

    //compare passwords with encrypted password
    let passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");

    return user;
};