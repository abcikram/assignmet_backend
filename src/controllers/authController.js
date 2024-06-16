const { signUser } = require('../services/auth.service')
const UserModel = require('../models/userModel')
const mongoose = require('mongoose');
const { generateToken } = require("../services/token.service");


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).json({
                status: false,
                message: "email or password is required",
            })
        }
        const user = await signUser(email, password);

        const token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.TOKEN_SECRET
        );


        res.status(200).json({
            status: true,
            message: "User login successfully",
            data: {
                id: user._id,
                token: token
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error!",
            error: error.message
        })
    }
}


const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        // const userData = await UserModel.findById(userId)

        //user aggregation :-
        const userData = await UserModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    __v: 0,
                    isDeleted: 0,
                    status:0
                }
            }
        ])

        res.status(200).json({ status: true, message: "User view profile", data: userData[0]})

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error!",
            error: error.message
        })
    }
}


const updateProfile = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        const userId = req.userId

        const file = req.file

        let uploadedFileUrl = null;
        if (file) {
            console.log(file)
            const validImage = file.mimetype.split('/');
            if (validImage[0] !== 'image') {
                return res.status(400).send({ status: false, message: 'Please provide a valid image.' });
            }
            uploadedFileUrl = `/uploads/${file.filename}`;
        }

        const updateData = { name, email, password };
        if (uploadedFileUrl) {
            updateData.picture = uploadedFileUrl;
        }

        // update the user data 
        const updateUser = await UserModel.findByIdAndUpdate(userId,
            {
                $set: updateData
            },
            {
                new: true
            }
        )

        if (!updateUser) {
            return res.status(404).json({
                status: false,
                message: "User data is not found",
            })
        }

        res.status(200).json({
            status: true,
            message: "User updated successfully",
            data: updateUser
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error!",
            error: error.message
        })
    }
}


module.exports = {  login, getProfile, updateProfile
}