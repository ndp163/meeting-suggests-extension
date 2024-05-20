import fs from 'fs';
import azureSdk from "microsoft-cognitiveservices-speech-sdk";
import LangChainService from '../services/langchainBase.service';
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
}

export default new TranslationController();
