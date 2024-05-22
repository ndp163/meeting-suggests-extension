// Based on sample from
// https://mellowship.dev/blog/amazon-transcribe-with-modern-web-audio-api-and-react
function encodeAudioChunkAsPCM(audioChunk) {
  let offset = 0;

  const resultArrayBuffer = new ArrayBuffer(audioChunk.length * 2);
  const resultDataView = new DataView(resultArrayBuffer);

  for (let i = 0; i < audioChunk.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, audioChunk[i]));
    resultDataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Uint8Array(resultArrayBuffer);
}

class RecordingProcessor extends AudioWorkletProcessor {
  audioChunkSize = 4096;
  currAudioChunkSize = 0;
  currAudioChunk = new Float32Array(this.audioChunkSize, 1, 1);

  constructor() {
    super();
    this.resetCurrAudioChunk();
  }

  /**
   * @returns {void}
   */
  resetCurrAudioChunk() {
    this.currAudioChunkSize = 0;
  }

  /**
   * @returns {boolean}
   */
  isBufferEmpty() {
    return this.currAudioChunkSize === 0;
  }

  /**
   * @returns {boolean}
   */
  isBufferFull() {
    return this.currAudioChunkSize === this.audioChunkSize;
  }

  /**
   * @param {Float32Array[][]} audioChunks
   * @returns {boolean}
   */
  process(inputs) {
    const channelData = inputs[0][0];

    if (this.isBufferFull()) {
      this.flush();
    }

    if (!channelData) return;

    for (let i = 0; i < channelData.length; i++) {
      this.currAudioChunk[this.currAudioChunkSize++] = channelData[i];
    }

    return true;
  }

  /**
   * @returns {void}
   */
  flush() {
    const audioChunk =
      this.currAudioChunkSize < this.audioChunkSize
        ? this.currAudioChunk.slice(0, this.currAudioChunkSize)
        : this.currAudioChunk;

    this.port.postMessage(encodeAudioChunkAsPCM(audioChunk));

    this.resetCurrAudioChunk();
  }
}

registerProcessor('recording-processor', RecordingProcessor);
