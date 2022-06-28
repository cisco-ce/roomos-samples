/*
TODO:
- add vu meter of microphone
- add optional warhol / treshold effect on video. or just css filters
*/
async function initVideo() {
  const props = {
    video: true,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(props);
    document.querySelector('#camera-feed').srcObject = stream;
  }
  catch(e) {
    console.warn('no video');
    document.querySelector('#camera').innerHTML = 'Camera not available';
  }
}

function sampleMicLevel(stream) {
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  mediaStreamAudioSourceNode.connect(analyserNode);

  const pcmData = new Float32Array(analyserNode.fftSize);
  const analyse = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude*amplitude;
      }
      const level =  Math.sqrt(sumSquares / pcmData.length);
      document.querySelector('#audio-level').innerHTML = parseInt(level * 100);
      // volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
  };
  setInterval(analyse, 200);
}

async function initAudio() {
  const props = { audio: true };
  try {
    const audio = await navigator.mediaDevices.getUserMedia(props);
    console.log('got audio');
    sampleMicLevel(audio);
  }
  catch(e) {
    console.warn('no audio');
    document.querySelector('#audio').innerHTML = 'Microphone not available';

  }
}

function init() {
  initVideo();
  initAudio();
}

window.onload = init;
