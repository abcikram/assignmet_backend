const express = require('express');
const { authentication } = require('../../middlewares/auth');
const { register, login, getProfile, updateProfile } = require('../../controllers/authController');
const upload  = require('../../services/multer.service');
const { viewCategory, categoryWiseQuestion } = require('../../controllers/userController');

const router = express.Router();


router.post('/register', register)
router.post('/login', login)
router.get('/profile', authentication , getProfile)
router.put('/profile', authentication, upload.single('image'),updateProfile)


router.get('/categories/all', viewCategory)
router.get('/question/:categorId', categoryWiseQuestion)



module.exports = router;