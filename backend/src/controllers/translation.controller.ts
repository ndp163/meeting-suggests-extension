import { Request, Response } from 'express';
import RagQAService from '../services/ragQA.service';
import 'dotenv/config';

class TranslationController {
  ragQAService;

  constructor() {
    this.ragQAService = new RagQAService();
  }

  async translate(req: Request, res: Response, next: Function) {
    await this.ragQAService.init();
    console.log(req);
    return res.json(await this.ragQAService.ask(req.body.text));
  }
}

export default new TranslationController();
