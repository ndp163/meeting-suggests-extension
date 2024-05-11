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
      console.log(result);
      console.log({errorDetails: result.errorDetails});
      console.log({reason: result.reason});
      console.log(`RECOGNIZED: Text=${result.text}`);
      speechRecognizer.close();
    });

    res.json({'message': 'ok'});
  }
}

module.exports = new TranslationController();
