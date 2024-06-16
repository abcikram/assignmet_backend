const express = require('express');
const { authentication } = require('../../middlewares/auth');
const { register, login, getProfile, updateProfile } = require('../../controllers/authController');
const upload  = require('../../services/multer.service');
const { viewCategory, categoryWiseQuestion } = require('../../controllers/userController');

const router = express.Router();


router.post('/register', register)

// user login 
router.post('/login', login)

// user view profile
router.get('/profile', authentication, getProfile)

//user update profile
router.put('/profile', authentication, upload.single('image'),updateProfile)

// view category 
router.get('/categories/all', viewCategory)

// List of questions for each category
router.get('/question/:categorId', categoryWiseQuestion)



module.exports = router;