const fs = require('fs');
const csv = require('csv-parser');
const Category = require('../models/categoryModel');
const Question = require('../models/questionModel');

const addBulkQuestion = async (req, res) =>{
    try {
        if (!req.file) {
            return res.status(400).json({status:false, message: 'No file uploaded' });
        }

        const csvFilePath = req.file.path;

        // Fetch all categories and create a map 
        const categories = await Category.find({isDeleted:false});
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // console.log(categoryMap)

        let questions = [];

        // Read and process the CSV file
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                const { question, categoryNames } = data;
                const categoryNamesArray = categoryNames.split(',').map(name => name.trim());

                const categoryIds = categoryNamesArray.map(name => categoryMap[name]);

                // Create question object
                questions.push({
                    question,
                    categories: categoryIds
                });

                // console.log("questions", questions)
            })
            .on('end', async () => {
                // Insert all of questions
                await Question.insertMany(questions);

                // cleanUp :- delete the uploaded file
                fs.unlink(csvFilePath, (err) => {
                    if (err) {
                        console.log('Error deleting file:', err);
                    }
                });

                res.status(200).json({ status: true, message: "questions added successfully", addedQuestion: `${questions.length}` });
            })
            .on('error', (err) => {
                res.status(500).json({ status: false, message: 'Failed to process CSV file', error: err.message });
            });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed to process CSV file', error: error.message });
    }
}


module.exports = { addBulkQuestion }
