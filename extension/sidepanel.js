const SAMPLE_RATE = 16000;

let recorder;
const TranslatedTextBox = document.getElementById('translated-text-box');
let TranslatingBox = document.createElement("p");
TranslatedTextBox.appendChild(TranslatingBox);

import io from "./socket.io.min.js";
const socket = io.connect("ws://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("translating_text", (text) => {
  TranslatingBox.innerText = text + "...";
});

socket.on("translated_text", (text) => {
  TranslatingBox.innerText = text;
  TranslatingBox = document.createElement("p");
  TranslatedTextBox.appendChild(TranslatingBox);
});

document.getElementById('start-transcribe').addEventListener('click', function () {
  alert("Started!");
  captureAudio();
});

document.getElementById('translate').addEventListener('click', async function () {
  TranslatedTextBox.innerHTML += `<p>${text}</p>`;
});

async function captureAudio() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  const streamId = await chrome.tabCapture.getMediaStreamId({
    targetTabId: tab.id
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
    sampleRate: SAMPLE_RATE
  });
	await context.audioWorklet.addModule('worklets.js');
	var newStream = context.createMediaStreamSource(stream);

	recorder = new AudioWorkletNode(context, 'recording-processor');
	newStream.connect(recorder);
	newStream.connect(context.destination);

	recorder.port.onmessage = (e) => {
    socket.emit("send_audio", e.data);
	};

	recorder.port.onmessageerror = (e) => {
		console.log(`Error receiving message from worklet ${e}`);
	};
}
