const express = require('express');
const {protectRoute} = require('../middlewares/auth.middleware');
const messageController = require('../controllers/message.controller');


const router = express.Router();


router.get("/users", protectRoute, messageController.getUsersForSidebar);
router.get("/:id", protectRoute, messageController.getMessages);
router.post("/send/:id", protectRoute, messageController.sendMessage);


module.exports = router;

