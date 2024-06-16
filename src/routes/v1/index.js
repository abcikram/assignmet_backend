const express = require('express');;
const router = express.Router();

const userRouter = require('./user');
const upload = require('../../services/multer.service');
const { addBulkQuestion } = require('../../controllers/bulkQuestionContoller');


// CSV file import for bulk question creation
router.post('/questions/bulk', upload.single('file'), addBulkQuestion);

router.use('/user', userRouter)


module.exports = router; 