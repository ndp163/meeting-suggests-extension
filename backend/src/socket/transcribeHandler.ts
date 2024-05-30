import { Server, Socket } from 'socket.io';
import * as azureSdk from "microsoft-cognitiveservices-speech-sdk";
import dotenv from 'dotenv';
import { SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
dotenv.config();

export default (io: Server, socket: Socket) => {
  const speechConfig = azureSdk.SpeechConfig.fromSubscription(process.env.STANDARD_SPEECH_KEY!, process.env.SPEECH_REGION!);
  let speechRecognizer!: SpeechRecognizer;
  let pushStream = azureSdk.AudioInputStream.createPushStream();

  const initTranscribe = (lang: string) => {
    speechConfig.speechRecognitionLanguage = lang;
    let audioConfig = azureSdk.AudioConfig.fromStreamInput(pushStream);
    speechRecognizer = new azureSdk.SpeechRecognizer(speechConfig, audioConfig);

    speechRecognizer.recognizing = (s, e) => {
      socket.emit("transcribing_result", e.result.text);
      console.log(`RECOGNIZING: Text=${e.result.text}`);
    };

    speechRecognizer.recognized = async (s, e) => {
      if (e.result.reason == azureSdk.ResultReason.RecognizedSpeech) {
        console.log(`RECOGNIZED: Text=${e.result.text}`);
        socket.emit("transcribed_result", {
          origin: e.result.text,
          translated: ""
        });
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
    };

    speechRecognizer.sessionStopped = (s, e) => {
      console.log("\n    Session stopped event.");
      speechRecognizer.stopContinuousRecognitionAsync();
    };
    speechRecognizer.startContinuousRecognitionAsync();
  }


  socket.on("init_transcribe", (data) => {
    if (speechRecognizer) {
      speechRecognizer.stopContinuousRecognitionAsync();
      speechRecognizer.close(() => {
        initTranscribe(data.lang);
      });
    } else {
      initTranscribe(data.lang);
    }
  })

  socket.on('send_audio', (data) => {
    pushStream.write(data);
  });

  socket.on('restart_transcribe', (data) => {
    console.log("Restart transcribe", data);
    if (speechRecognizer) {
      speechRecognizer.stopContinuousRecognitionAsync(() => {
        speechRecognizer.startContinuousRecognitionAsync();
      });
    }
  });
}
