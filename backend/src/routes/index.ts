import express from 'express';
import multer from 'multer';
import translationController from '../controllers/translation.controller';

const upload = multer({dest:'.'});
const router = express.Router();

router.post('/translate', upload.single('audio'), translationController.translate);

export default router;
