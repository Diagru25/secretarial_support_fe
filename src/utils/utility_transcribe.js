import io from "socket.io-client";

const socket = new io.connect("wss://172.16.0.85:30100/");

// Connect status
socket.on("connect", (msg) => {
  console.log(msg);
});

// Stream Audio
let bufferSize = 2048,
  AudioContext,
  context,
  processor,
  input,
  globalStream;

const mediaConstraints = {
  audio: true,
  video: false,
};

let count = 1;
export const bufferData = [];
let recordingLength = 0;
export const objBlob = {
    blob: null
}
var leftchannel = [];
var rightchannel = [];

let AudioStreamer = {
  /**
   * @param {object} transcribeConfig Transcription configuration such as language, encoding, etc.
   * @param {function} onData Callback to run on data each time it's received
   * @param {function} onError Callback to run on an error if one is emitted.
   */

  initRecording: function (transcribeConfig, onData, onError) {
    socket.emit("start");
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
      sampleRate: 16000,
    });
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();

    const handleSuccess = function (stream) {
      globalStream = stream;
      input = context.createMediaStreamSource(stream);
      input.connect(processor);

      processor.onaudioprocess = function (e) {
        leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
        recordingLength += bufferSize;
        microphoneProcess(e);
      };
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(handleSuccess);

    // Socket event from socket server
    // Speech data response
    if (onData) {
      socket.on("speechData", (response) => {
        console.log("speech data received from server!");
        onData(response.data, response.isFinal);
      });
    }

    socket.on("queue_changed", (data) => {
      console.log(
        `queue_length=${data.queue_len}, last_sample_size=${data.last_sample_size}`
      );
    });

    socket.on("googleCloudStreamError", (error) => {
      if (onError) {
        onError("error");
      }
      closeAll();
    });

    socket.on("endGoogleCloudStream", () => {
      closeAll();
    });
  },

  stopRecording: function () {
    socket.emit("stop");
    closeAll();
  },
};

export default AudioStreamer;

// Helper functions
/**
 * Processes microphone data into a data stream
 *
 * @param {object} e Input from the microphone
 */
function microphoneProcess(e) {
  const left = e.inputBuffer.getChannelData(0);
  const left16 = convertFloat32ToInt16(left);
  //bufferData.push(left16);
  socket.emit("binaryAudioData", { chunk: left16, count });
  count += 1;
}

/**
 * Converts a buffer from float32 to int16. Necessary for streaming.
 * sampleRateHertz of 16000.
 *
 * @param {object} buffer Buffer being converted
 */
function convertFloat32ToInt16(buffer) {
  let len = buffer.length;
  var output = new Int16Array(len);
  for (var i = 0; i < len; i++) {
    var s = Math.max(-1, Math.min(1, buffer[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output.buffer;
}

// include downsampling and transform float32 to int16 ????
// function convertFloat32ToInt16(buffer) {
//   let l = buffer.length;
//   let buf = new Int16Array(l / 3);

//   while (l--) {
//     if (l % 3 === 0) {
//       buf[l / 3] = buffer[l] * 0xFFFF;
//     }
//   }
//   return buf.buffer
// }

/**
 * Stops recording and closes everything down. Runs on error or on stop.
 */
function closeAll() {
  // Clear the listeners (prevents issue if opening and closing repeatedly)
  socket.off("speechData");
  socket.off("googleCloudStreamError");
  let tracks = globalStream ? globalStream.getTracks() : null;
  let track = tracks ? tracks[0] : null;
  var leftBuffer = flattenArray(leftchannel, recordingLength);
  // we interleave both channels together
  // [left[0],right[0],left[1],right[1],...]
  var interleaved = interleave(leftBuffer);

  // we create our wav file
  var buffer = new ArrayBuffer(44 + interleaved.length * 2);
  var view = new DataView(buffer);
  // RIFF chunk descriptor
  writeUTFBytes(view, 0, "RIFF");
  view.setUint32(4, 44 + interleaved.length * 2, true);
  writeUTFBytes(view, 8, "WAVE");
  // FMT sub-chunk
  writeUTFBytes(view, 12, "fmt ");
  view.setUint32(16, 16, true); // chunkSize
  view.setUint16(20, 1, true); // wFormatTag
  view.setUint16(22, 1, true); // wChannels: stereo (2 channels)
  view.setUint32(24, 16000, true); // dwSamplesPerSec
  view.setUint32(28, 16000 * 2, true); // dwAvgBytesPerSec
  view.setUint16(32, 4, true); // wBlockAlign
  view.setUint16(34, 16, true); // wBitsPerSample
  // data sub-chunk
  writeUTFBytes(view, 36, "data");
  view.setUint32(40, interleaved.length * 2, true);

  // write the PCM samples
  var index = 44;
  var volume = 1;
  for (var i = 0; i < interleaved.length; i++) {
    view.setInt16(index, interleaved[i] * (0x7fff * volume), true);
    index += 2;
  }

  // our final blob
  objBlob.blob = new Blob([view], { type: "audio/wav" });

  if (track) {
    track.stop();
  }

  if (processor) {
    if (input) {
      try {
        input.disconnect(processor);
      } catch (error) {
        console.warn("Attempt to disconnect input failed.");
      }
    }
    processor.disconnect(context.destination);
  }

  if (context) {
    context.close().then(function () {
      input = null;
      processor = null;
      context = null;
      AudioContext = null;
    });
  }
}

function flattenArray(channelBuffer, recordingLength) {
  var result = new Float32Array(recordingLength);
  var offset = 0;
  for (var i = 0; i < channelBuffer.length; i++) {
    var buffer = channelBuffer[i];
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}

function interleave(leftChannel) {
  var length = leftChannel.length;
  var result = new Float32Array(length);

  var inputIndex = 0;

  for (var index = 0; index < length; ) {
    result[index++] = leftChannel[inputIndex];
    //result[index++] = rightChannel[inputIndex];
    inputIndex++;
  }
  return result;
}

function writeUTFBytes(view, offset, string) {
  for (var i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
