import fs from 'fs';
import azureSdk from "microsoft-cognitiveservices-speech-sdk";
import LangChainService from "../services/langchain.service";
import dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();

class TranslationController {
  async translate(req: Request, res: Response, next: Function) {
    if (!req.file) {
      throw Error();
    }
    const speechConfig = azureSdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY!, process.env.SPEECH_REGION!);
    speechConfig.speechRecognitionLanguage = "en-US";

    let audioConfig = azureSdk.AudioConfig.fromWavFileInput(fs.readFileSync(req.file.filename));
    
    let speechRecognizer = new azureSdk.SpeechRecognizer(speechConfig, audioConfig);
    speechRecognizer.recognizeOnceAsync(result => {
      console.log({text: result.text});
      speechRecognizer.close();
      res.json({ text: result.text });
    });
  }

  async suggest(req: Request, res: Response, next: Function) {
    const langChainService = new LangChainService();
    await langChainService.init();
    res.json(await langChainService.getMatching());
  }

  async addDocuments(req: Request, res: Response, next: Function) {
    const langChainService = new LangChainService();
    await langChainService.init();
    await langChainService.addDocuments();
  }
}

export default new TranslationController();
