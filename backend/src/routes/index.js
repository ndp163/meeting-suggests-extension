const express = require('express');
const multer = require('multer');
const translationController = require('../controllers/translation.controller');
const router = express.Router();
const upload = multer({dest:'.'});

router.post('/translate', upload.single('audio'), translationController.translate);

module.exports = router;
