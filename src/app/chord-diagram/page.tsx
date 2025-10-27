"use client";

import React, { useState, useEffect } from "react";
import GuitarChordDiagram from "./guitar-chord-diagram";
import { Button } from "~/components/ui/button";
// import { EssentiaClass, EssentiaWASM } from "essentia.js"
// @ts-ignore
// import Essentia from 'https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-core.es.js';
// import essentia-wasm-module
// @ts-ignore
// import { EssentiaWASM } from 'https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia-wasm.es.js';



export default function Lesson1() {
  const [stringStates, setStringStates] = useState(Array(6).fill("neutral"));
  const [listening, setListening] = useState(false);
  const [essentiaReady, setEssentiaReady] = useState(false);

  const positions = [null, 3, 2, 0, 1, 0]; // C major chord
  const expectedFreqs = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]; // EADGBE

  // Wait for Essentia to load from the global window
  useEffect(() => {
    const checkEssentia = setInterval(() => {
      if ((window as any).Essentia || (window as any).EssentiaJS) {
        clearInterval(checkEssentia);
        setEssentiaReady(true);
        console.log("Essentia.js is ready:", Object.keys(window));
      }
    }, 500);

    return () => clearInterval(checkEssentia);
  }, []);

  async function startListening() {
    if (!essentiaReady) {
      alert(" Essentia.js not yet loaded. Please wait a moment.");
      return;
    }

    try {
      setListening(true);

      console.log("ABC")
      const EssentiaClass = (window as any).Essentia;
      const EssentiaWASM = (window as any).EssentiaWASM || (window as any).EssentiaWASM;
      console.log("123")
      console.log(EssentiaClass)
      console.log(EssentiaWASM)

      let essentia: any;
      EssentiaWASM().then( function(EssentiaWasm) {
        essentia = new EssentiaClass(EssentiaWasm);
        // prints version of the essentia wasm backend
        console.log(essentia.version)
        // prints all the available algorithms in essentia.js 
        console.log(essentia.algorithmNames);

        // add your custom audio feature extraction callbacks here
      });

      return null;

      essentia = new EssentiaClass(EssentiaWASM);

      console.log("Essentia instance created. Available methods:", Object.keys(essentia).slice(0, 20));

      const audioCtx = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log(stream);
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      const detect = () => {
        analyser.getFloatTimeDomainData(buffer);

        // Normalize to [-1, 1]
        const max = Math.max(...buffer.map(Math.abs));
        if (max > 0) buffer.forEach((_, i) => (buffer[i] /= max));

        let result: any;
        if (typeof essentia.PitchYin === "function") {
          result = essentia.PitchYin(buffer);
        } else if (typeof essentia.PitchYinFFT === "function") {
          const spectrum = essentia.Spectrum(buffer);
          result = essentia.PitchYinFFT(spectrum);
        } else {
          console.warn("No pitch detection algorithm available.");
          return;
        }

        const pitch = result.pitch ?? result[0];
        const confidence = result.pitchConfidence ?? result[1] ?? 0;

        if (confidence > 0.5 && pitch > 40 && pitch < 400) {
          console.log(" Detected:", pitch.toFixed(2), "Hz");
          const tol = 3; // tolerance
          const newStates = expectedFreqs.map((f) =>
            Math.abs(f - pitch) < tol ? "correct" : "neutral"
          );
          setStringStates(newStates);
        }

        requestAnimationFrame(detect);
      };

      detect();
    } catch (err: any) {
      console.error(" Mic access denied or error:", err);
      alert("Please allow microphone access and retry.");
      setListening(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-200 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">C Major Chord Trainer</h1>

      <GuitarChordDiagram
        chordName="C Major"
        positions={positions}
        stringStates={stringStates}
      />

      <Button
        onClick={startListening}
        disabled={!essentiaReady}
        className="bg-white text-gray-800 font-medium py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50"
      >
        {essentiaReady ? "Listen " : "Loading Essentia..."}
      </Button>
    </div>
  );
}
