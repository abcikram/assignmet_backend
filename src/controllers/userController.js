const categoryModel = require('../models/categoryModel')
const mongoose = require('mongoose')
const questionModel = require('../models/questionModel')

const viewCategory = async (req, res) => {
    try {
        const data = await categoryModel.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $project: {
                    isDeleted: 0, __v: 0
                }
            }
        ])

        res.status(200).json({
            status: true,
            message: "View category Data",
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error!",
            error: error.message
        })
    }
}


const categoryWiseQuestion = async (req, res) => {
    try {
        const { categorId } = req.params

        if (!mongoose.isValidObjectId(categorId)) {
            return res.status(400).json({
                status: false,
                messages: "categoryId is not valid"
            })
        }

        const questions = await questionModel.aggregate([
            {
                $match: {
                    categories: new mongoose.Types.ObjectId(categorId)
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categories",
                    foreignField: "_id",
                    as: "catergoryData",
                    pipeline: [
                        {
                            $match: {
                                isDeleted: false,
                            }
                        },
                        {
                            $project: {
                                name:1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    isDeleted: 0,
                    __v: 0
                }
            }
        ])

        if (questions.length === 0) {
            return res.status(404).json({status:false,message: 'No questions found for this category' });
        }
        
        res.status(200).json({
            status: true,
            message: "view category wise question",
            data: questions
        })



    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error!",
            error: error.message
        })
    }
}


module.exports = { viewCategory, categoryWiseQuestion }