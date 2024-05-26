import { Request, Response } from 'express';
import RagQAService from '../services/ragQA.service';
import 'dotenv/config';
import MeetingBotService from '../services/meetingBot.service';

class MeetingController {
  ragQAService;
  meetingBotService;

  constructor() {
    this.ragQAService = new RagQAService();
    this.meetingBotService = new MeetingBotService();
  }

  async translate(req: Request, res: Response, next: Function) {
    await this.ragQAService.init();
    console.log(req);
    return res.json(await this.ragQAService.ask(req.body.text));
  }

  async summary(req: Request, res: Response, next: Function) {
    return res.json(await this.meetingBotService.summary(req.body.text));
  }
}

export default new MeetingController();
