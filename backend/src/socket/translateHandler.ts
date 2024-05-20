import { Server, Socket } from 'socket.io';
import * as azureSdk from "microsoft-cognitiveservices-speech-sdk";
import dotenv from 'dotenv';
import MeetingBotService from '../services/meetingBot.service';
dotenv.config();

export default (io: Server, socket: Socket) => {
  const speechConfig = azureSdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY!, process.env.SPEECH_REGION!);
  speechConfig.speechRecognitionLanguage = "en-US";
  let pushStream = azureSdk.AudioInputStream.createPushStream();
  let audioConfig = azureSdk.AudioConfig.fromStreamInput(pushStream);
  let speechRecognizer = new azureSdk.SpeechRecognizer(speechConfig, audioConfig);

  const meetingBotService = new MeetingBotService();

  speechRecognizer.recognizing = (s, e) => {
    socket.emit("translating_text", e.result.text);
    console.log(`RECOGNIZING: Text=${e.result.text}`);
  };

  speechRecognizer.recognized = async (s, e) => {
    if (e.result.reason == azureSdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text}`);
      // const translatedText = await meetingBotService.suggest(e.result.text);
      // console.log({ translatedText });
      socket.emit("translated_text", e.result.text);
    }
    else if (e.result.reason == azureSdk.ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
      console.log(e.result);
    }
  };

  speechRecognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == azureSdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log("CANCELED: Did you set the speech resource key and region values?");
    }

    speechRecognizer.stopContinuousRecognitionAsync();
  };

  speechRecognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    speechRecognizer.stopContinuousRecognitionAsync();
  };

  speechRecognizer.startContinuousRecognitionAsync();

  socket.on('send_audio', (data) => {
    pushStream.write(data);
  });
}