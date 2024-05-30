import { useEffect, useRef, useState } from "react";
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook";
import TextBox from "../components/TextBox";
import { socket } from "../socket";
import { LANG_CODE, STORAGE_KEY } from '../constants';

const MY_NAME = "Tôi";
const MY_AVATAR =
  "https://lh3.googleusercontent.com/a/ACg8ocIeHeRbRQj8ROIRcEWUgmroxFXPsseL8bFk-IBBi2OpuAzbwQCX=s192-c-mo";
function TranscribePage({ meetingId }) {
  const [transcribingResult, setTranscribingResult] = useState("Listening");
  const [myTranscribingResult, setMyTranscribingResult] = useState("");
  const [tabId, setTabId] = useState(null);
  const [language, setLanguage] = useState(LANG_CODE.ENGLISH);
  const [chromePort, setChromePort] = useState(null);

  const [meetings, setMeetings] = useStorage({
    key: STORAGE_KEY,
    instance: new Storage({
      area: "local"
    }),
  });
  const meetingTitle = useRef("");

  useEffect(() => {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }).then(tabs => {
      setTabId(tabs[0].id);
    });

    return () => {
    }
  }, []);


  useEffect(() => {
    if (!tabId) return;

    const port = chrome.tabs.connect(tabId);
    setChromePort(port);
    onChromePortMessage(port);

    async function onTranscribedResult(content) {
      const speaker = await chrome.tabs.sendMessage(tabId, {
        command: "getParticipantTalking"
      });
      setTranscribingResult("");
      addToMeetingsStorage(speaker, content.origin);
    }
    function onTranscribingResult(text) {
      setTranscribingResult(text);
    }

    socket.on("transcribing_result", onTranscribingResult);
    socket.on("transcribedResult", onTranscribedResult);
    return () => {
      socket.off("transcribedResult", onTranscribedResult);
      socket.off("transcribing_result", onTranscribingResult);
      port.disconnect();
    };
  }, [tabId]);

  function onChromePortMessage(port) {
    port.onMessage.addListener(function (msg) {
      if (msg.myTranscribingResult) {
        setMyTranscribingResult(msg.myTranscribingResult);
      } else if (msg.myTranscribedResult) {
        setMyTranscribingResult("");
        addToMeetingsStorage(
          {
            name: MY_NAME,
            avatar: MY_AVATAR
          },
          msg.myTranscribedResult
        );
      } else if (msg.restartTranscribe) {
        console.log("Restart transcribe...");
        socket.emit("restart_transcribe");
      } else if (msg.meetingTitle) {
        console.log(msg.meetingTitle);
        meetingTitle.current = msg.meetingTitle;
      }
    });
  }
  function addToMeetingsStorage(speaker, text) {
    setMeetings((meeetings) => {
      if (!meeetings) {
        meeetings = {};
      };

      const currentMeeting = meeetings[meetingId] || {
        title: meetingTitle.current,
        startAt: meetingId,
        contents: []
      };
      if (!currentMeeting.length) {
        meeetings[meetingId] = currentMeeting;
      }
      const lastContentItem =
        currentMeeting.contents[currentMeeting.contents.length - 1];
      if (
        lastContentItem &&
        speaker?.name === lastContentItem.name &&
        !lastContentItem.translated && !lastContentItem.suggest
      ) {
        lastContentItem.origin += " " + text;
        return meeetings;
      } else {
        currentMeeting.contents.push({
          origin: text,
          translated: "",
          name: speaker?.name,
          avatar: speaker?.avatar
        });

        return meeetings;
      }
    });
  }
  async function startTranscribe() {
    socket.emit("init_transcribe", {
      lang: language
    });

    chromePort.postMessage({
      command: "detectTalking",
      data: {
        lang: language
      }
    });

    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: tabId
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId
        }
      }
    });

    console.log("Start capture...");

    const context = new AudioContext({
      sampleRate: 16000
    });
    await context.audioWorklet.addModule("./worklets.js");
    var newStream = context.createMediaStreamSource(stream);

    const recorder = new AudioWorkletNode(context, "recording-processor");
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
    <div className="m-2 mt-5">
      <div className="flex justify-start">
        <form onChange={(e) => setLanguage(e.target.value)}>
          <select
            id="languages"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option disabled selected>
              Choose language
            </option>
            <option value={LANG_CODE.ENGLISH}>English</option>
            <option value={LANG_CODE.VIETNAMESE}>Vietnamese</option>
            <option value={LANG_CODE.JAPANESE}>Japanese</option>
          </select>
        </form>
        <button
          className="ml-4 bg-slate-200 hover:bg-slate-300 py-2 px-2 rounded"
          onClick={startTranscribe}>
          Start Transcribe
        </button>
      </div>
      <div className="mt-4">
        {meetings?.[meetingId]?.contents.map((content, index) => (
          <TextBox
            key={index}
            content={content}
            index={index}
            meetingId={meetingId}
          />
        ))}
        {transcribingResult && <p className="italic">{transcribingResult}...</p>}
        {myTranscribingResult && (
          <div className="flex">
            <span className="font-bold mr-2">{MY_NAME}</span>
            <p className="italic">{myTranscribingResult}...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TranscribePage;
