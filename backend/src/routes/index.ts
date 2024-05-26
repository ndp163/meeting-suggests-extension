import express from 'express';
import multer from 'multer';
import meetingController from '../controllers/meeting.controller';

const upload = multer({dest:'.'});
const router = express.Router();

router.post('/translate',  meetingController.translate.bind(meetingController));
router.post('/summary',  meetingController.summary.bind(meetingController));

export default router;
