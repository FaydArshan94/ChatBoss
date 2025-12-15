const express = require('express');
const authController = require('../controllers/auth.controller');
const { protectRoute } = require('../middlewares/auth.middleware');


const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.put("/update-profile", protectRoute, authController.updateProfile)
router.get("/me",protectRoute, authController.getMe);


module.exports = router;
