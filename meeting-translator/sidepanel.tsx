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

function IndexSidePanel() {
  const [recordingText, setRecordingText] = useState("Listening");
  const [historyTexts, setHistoryTexts] = useState<HistoryText[]>([{
    origin: 'Hello World!',
    translated: 'Xin chào thế giới!',
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIeHeRbRQj8ROIRcEWUgmroxFXPsseL8bFk-IBBi2OpuAzbwQCX=s192-c-mo",
    name: 'Nguyễn Đình Phúc'
  }]);

  useEffect(() => {
    function onTranslatingText(text) {
      setRecordingText(text);
    }

    function onTranslatedText(content) {
      setRecordingText("");
      setHistoryTexts((historyTexts) => [...historyTexts, {
        ...content,
        name: 'Nguyễn Đình Phúc',
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocIeHeRbRQj8ROIRcEWUgmroxFXPsseL8bFk-IBBi2OpuAzbwQCX=s192-c-mo"
      }]);
    }

    socket.on("translating_text", onTranslatingText);
    socket.on("translated_text", onTranslatedText);

    return () => {
      socket.off("translating_text", onTranslatingText);
      socket.off("translated_text", onTranslatedText);
    }
  }, []);

  async function transcribeAudio() {
    alert("Start transcribe");
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  
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

  return (
    <div className='m-3'>
      <button className="bg-slate-200 hover:bg-slate-300 py-2 px-2 rounded" onClick={transcribeAudio}>Start Transcribe</button>
      <button className='bg-slate-200 hover:bg-slate-300 py-2 px-2 rounded ml-2' id="translate">Translate</button>
      <div className='mt-2'>
        {historyTexts.map((content, index) => <TextBox key={ index } content={ content } />)}
        { recordingText && <p className='italic'>{ recordingText }...</p> }
      </div>
    </div>
  )
}

export default IndexSidePanel
