const SAMPLE_RATE = 44100;

document.getElementById('start-capture').addEventListener('click', function () {
	captureAudio();
});

async function captureAudio() {
	// chrome.tabCapture.capture({audio: true, video: false}, async (stream) => {
  // const stream = await navigator.mediaDevices
  //   .getUserMedia({
  //     audio: {
  //       sampleRate: SAMPLE_RATE,
  //       channelCount: 1,
  //       echoCancellation: true,
  //     },
  //     video: false,
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     throw error;
  //   });


  const stream = await navigator.mediaDevices.getDisplayMedia({ audio: {
    sampleRate: SAMPLE_RATE,
    echoCancellation: true
  } });
	console.log('Start capture...');
  const [track] = stream.getAudioTracks();

	// these lines enable the audio to continue playing while capturing
	const context = new AudioContext({ sampleRate: SAMPLE_RATE });
	await context.audioWorklet.addModule('worklets.js');
	var newStream = context.createMediaStreamSource(stream);

	// const recorder = new MediaRecorder(stream, {
	//   mimeType: 'audio/webm'
	// });

	const chunks = [];
	// recorder.ondataavailable = (e) => {
	//     console.log("OKEEÊ");
	//     chunks.push(e.data);
	// };
	// recorder.onstop = (e) => saveToFile(new Blob(chunks, {
	//   type: recorder.mimeType
	// }), "test.webm");
	// recorder.start();
	// setTimeout(() => recorder.stop(), 5000);
	const recorder = new AudioWorkletNode(context, 'recording-processor');
	newStream.connect(recorder);
	recorder.port.onmessage = (e) => {
		console.log(e.data);
		chunks.push(e.data);
	};

	recorder.port.onmessageerror = (e) => {
		console.log(`Error receiving message from worklet ${e}`);
	};

  setTimeout(() => {
    saveToFile(encodeAudio(chunks, track.getSettings()), "test.wav");
  }, 10000);
	// })
}

function saveToFile(blob, name) {
  const data = new FormData();
  data.append('audio', blob, 'audio.wav');
  fetch('http://localhost:3000/translate', {
    method: 'POST',
    body: data
  }).then(response => response.json()).then(json => console.log(json));
}

function encodeAudio (buffers, settings) {
  const sampleCount = buffers.reduce((memo, buffer) => {
    return memo + buffer.length
  }, 0)

  const bytesPerSample = settings.sampleSize / 8
  const bitsPerByte = 8
  const dataLength = sampleCount * bytesPerSample
  const sampleRate = settings.sampleRate

  const arrayBuffer = new ArrayBuffer(44 + dataLength)
  const dataView = new DataView(arrayBuffer)

  dataView.setUint8(0, 'R'.charCodeAt(0)) // <10>
  dataView.setUint8(1, 'I'.charCodeAt(0))
  dataView.setUint8(2, 'F'.charCodeAt(0))
  dataView.setUint8(3, 'F'.charCodeAt(0))
  dataView.setUint32(4, 36 + dataLength, true)
  dataView.setUint8(8, 'W'.charCodeAt(0))
  dataView.setUint8(9, 'A'.charCodeAt(0))
  dataView.setUint8(10, 'V'.charCodeAt(0))
  dataView.setUint8(11, 'E'.charCodeAt(0))
  dataView.setUint8(12, 'f'.charCodeAt(0))
  dataView.setUint8(13, 'm'.charCodeAt(0))
  dataView.setUint8(14, 't'.charCodeAt(0))
  dataView.setUint8(15, ' '.charCodeAt(0))
  dataView.setUint32(16, 16, true)
  dataView.setUint16(20, 1, true)
  dataView.setUint16(22, 1, true)
  dataView.setUint32(24, sampleRate, true)
  dataView.setUint32(28, sampleRate * 2, true)
  dataView.setUint16(32, bytesPerSample, true)
  dataView.setUint16(34, bitsPerByte * bytesPerSample, true)
  dataView.setUint8(36, 'd'.charCodeAt(0))
  dataView.setUint8(37, 'a'.charCodeAt(0))
  dataView.setUint8(38, 't'.charCodeAt(0))
  dataView.setUint8(39, 'a'.charCodeAt(0))
  dataView.setUint32(40, dataLength, true)

  let index = 44

  for (const buffer of buffers) {
    for (const value of buffer) {
      dataView.setInt16(index, value * 0x7fff, true)
      index += 2
    }
  }

  return new Blob([dataView], {type: 'audio/wav'});
}