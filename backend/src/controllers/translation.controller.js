const fs = require('fs');
const azureSdk = require("microsoft-cognitiveservices-speech-sdk");
require('dotenv').config();

class TranslationController {
  async translate(req, res, next) {
    const speechConfig = azureSdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
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

module.exports = new TranslationController();
