let Essentia: any;
let EssentiaWASM: any;

export async function loadEssentia() {
  if (!Essentia || !EssentiaWASM) {
    const module = await import("essentia.js");
    Essentia = module.Essentia;
    EssentiaWASM = module.EssentiaWASM;
  }
  return { Essentia, EssentiaWASM };
}


export async function initPitchDetection(callback: (freq: number) => void) {
  const essentia = new Essentia(EssentiaWASM);

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const buffer = new Float32Array(analyser.fftSize);
  source.connect(analyser);

  const detectPitch = () => {
    analyser.getFloatTimeDomainData(buffer);
    const result = essentia.PitchYinFFT(buffer);
    const freq = result.pitch;
    if (freq > 0) callback(freq);
    requestAnimationFrame(detectPitch);
  };

  detectPitch();
}
