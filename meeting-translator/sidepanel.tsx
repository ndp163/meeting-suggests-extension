import { useEffect, useState } from "react"
import "./style.css"
import TextBox from './components/TextBox'
import { socket } from './socket';

export interface HistoryText {
  origin: string;
  translated: string;
  avatar: string;
  name: string;
}

const OWN_NAME = "Tôi";

function IndexSidePanel() {
  const [recordingText, setRecordingText] = useState("Listening");
  const [myVoiceDetecting, setMyVoiceDetecting] = useState("");
  const [tabId, setTabId] = useState(null);
  const [historyTexts, setHistoryTexts] = useState<HistoryText[]>([{
    origin: 'Hello World!',
    translated: 'Xin chào thế giới!',
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIeHeRbRQj8ROIRcEWUgmroxFXPsseL8bFk-IBBi2OpuAzbwQCX=s192-c-mo",
    name: OWN_NAME
  }]);

  useEffect(() => {
    function onTranslatingText(text) {
      setRecordingText(text);
    }

    socket.on("translating_text", onTranslatingText);
    return () => {
      socket.off("translating_text", onTranslatingText);
    }
  }, []);

  useEffect(() => {
    async function onTranslatedText(content) {
      const speaker = await chrome.tabs.sendMessage(tabId, {command: "getParticipantTalking"});
      setRecordingText("");
      const lastHistoryText = historyTexts[historyTexts.length - 1];
      if (speaker.name === lastHistoryText.name && !lastHistoryText.translated) {
        lastHistoryText.origin += "\n" + content.origin;
        setHistoryTexts((historyTexts) => [...historyTexts]);  
      } else {
        setHistoryTexts((historyTexts) => [...historyTexts, {
          ...content,
          name: speaker?.name,
          avatar: speaker?.avatar
        }]);
      }
    }

    socket.on("translated_text", onTranslatedText);
    return () => {
      socket.off("translated_text", onTranslatedText);
    }
  }, [tabId, historyTexts]);

  async function transcribeAudio() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    setTabId(tab.id);
    const port = chrome.tabs.connect(tab.id);
    port.postMessage({ command: "detectTalking" });
    port.onMessage.addListener(function(msg) {
      if (msg.myVoiceDetecting) {
        setMyVoiceDetecting(msg.myVoiceDetecting);
      } else if (msg.myVoiceDetected) {
        setMyVoiceDetecting("");
          setHistoryTexts((historyTexts) => {
            const lastHistoryText = historyTexts[historyTexts.length - 1];
            if (OWN_NAME === lastHistoryText.name && !lastHistoryText.translated) {
              lastHistoryText.origin += "\n" + msg.myVoiceDetected;
              return [...historyTexts];
            } else {
              return [...historyTexts, {
                origin: msg.myVoiceDetected,
                translated: "",
                name: OWN_NAME,
                avatar: "https://lh3.googleusercontent.com/a/ACg8ocIeHeRbRQj8ROIRcEWUgmroxFXPsseL8bFk-IBBi2OpuAzbwQCX=s192-c-mo"
              }];
            }
          });  
      }
    });

    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tab.id,
    });
  
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'tab',
          chromeMediaSourceId: streamId
        }
      }
    });

    console.log('Start capture...');

    const context = new AudioContext({
      sampleRate: 16000
    });
    await context.audioWorklet.addModule('./worklets.js');
    var newStream = context.createMediaStreamSource(stream);
    console.log("OKEEE");
  
    const recorder = new AudioWorkletNode(context, 'recording-processor');
    newStream.connect(recorder);
    newStream.connect(context.destination);
  
    recorder.port.onmessage = (e) => {
      socket.emit("send_audio", e.data);
    };
  
    recorder.port.onmessageerror = (e) => {
      console.log(`Error receiving message from worklet ${e}`);
    };
  }

  async function translateText(content: HistoryText) {
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: content.origin
      })
    });
    content.translated = await response.json();
    setHistoryTexts((historyTexts) => [...historyTexts]);
  }

  return (
    <div className='m-3'>
      <button className="bg-slate-200 hover:bg-slate-300 py-2 px-2 rounded" onClick={transcribeAudio}>Start Transcribe</button>
      <div className='mt-2'>
        {historyTexts.map((content, index) => <TextBox key={ index } content={ content } translateText={translateText} />)}
        { recordingText && <p className='italic'>{ recordingText }...</p> }
        { myVoiceDetecting && <div className='flex'>
          <span className='font-bold mr-2'>{ OWN_NAME }</span>
          <p className='italic'>{ myVoiceDetecting }...</p>
        </div> }
      </div>
    </div>
  )
}

export default IndexSidePanel
