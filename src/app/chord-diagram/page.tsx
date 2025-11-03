"use client";

import React, { useState, useEffect } from "react";
import GuitarChordDiagram from "./guitar-chord-diagram";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation'

export default function Lesson1() {
  const chords = [
    {
      name: "C Major",
      positions: [null, 3, 2, 0, 1, 0],
      expectedFreqs: [82.41, 110.0, 146.83, 196.0, 246.94, 329.63],
      strings: ["E (low)", "A", "D", "G", "B", "E (high)"],
    },
    {
      name: "G Major",
      positions: [3, 2, 0, 0, 0, 3],
      expectedFreqs: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0],
      strings: ["E (low)", "A", "D", "G", "B", "E (high)"],
    },
    {
      name: "A Minor",
      positions: [null, 0, 2, 2, 1, 0],
      expectedFreqs: [82.41, 110.0, 146.83, 220.0, 261.63, 329.63],
      strings: ["E (low)", "A", "D", "G", "B", "E (high)"],
    },
  ];

  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [lessonStage, setLessonStage] = useState<"single" | "strum" | "next" | "done">("single");
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [stringStates, setStringStates] = useState(Array(6).fill("neutral"));
  const [essentiaReady, setEssentiaReady] = useState(false);
  const [listening, setListening] = useState(false);
  const router = useRouter();


  // Load Essentia.js
  useEffect(() => {
    const checkEssentia = setInterval(() => {
      if ((window as any).Essentia && (window as any).EssentiaWASM) {
        clearInterval(checkEssentia);
        setEssentiaReady(true);
        console.log("✅ Essentia ready");
      }
    }, 500);
    return () => clearInterval(checkEssentia);
  }, []);

  async function startListening() {
    if (!essentiaReady) {
      alert("Please wait, Essentia.js not ready yet.");
      return;
    }

    const EssentiaClass = (window as any).Essentia;
    const EssentiaWASM = (window as any).EssentiaWASM;
    const wasm = await EssentiaWASM();
    const essentia = new EssentiaClass(wasm);

    console.log("🎸 Starting mic...");
    setListening(true);

    const audioCtx = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    src.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);

    const detect = () => {
      analyser.getFloatTimeDomainData(buffer);
      const audioVector = essentia.arrayToVector(buffer);
      const pitchData = essentia.PitchYin(audioVector);
      const pitch = pitchData.pitch;
      const confidence = pitchData.pitchConfidence;
      const chord = chords[currentChordIndex];

      if (confidence > 0.7 && pitch > 40 && pitch < 600) {
        const expectedPitch = chord.expectedFreqs[currentStringIndex];
        const tolerance = 3;

        if (
          Math.abs(pitch - expectedPitch) < tolerance &&
          chord.positions[currentStringIndex] !== null
        ) {
          console.log(`✅ Correct pitch for string ${currentStringIndex + 1}`);
          const updated = [...stringStates];
          updated[currentStringIndex] = "correct";
          setStringStates(updated);

          if (currentStringIndex < 5) {
            setCurrentStringIndex((prev) => prev + 1);
          } else {
            console.log("🎵 All single strings done! Proceed to strum.");
            setLessonStage("strum");
          }
        }
      }

      requestAnimationFrame(detect);
    };
    detect();
  }

  // Fake strum detector (for now)
  const handleStrumDetected = () => {
    console.log("🎶 Strum detected!");
    setLessonStage("next");
  };

  const nextChord = () => {
    if (currentChordIndex < chords.length - 1) {
      setCurrentChordIndex((i) => i + 1);
      setLessonStage("single");
      setCurrentStringIndex(0);
      setStringStates(Array(6).fill("neutral"));
    } else {
      setLessonStage("done");
      setListening(false);
    }
  };

  const chord = chords[currentChordIndex];
  const progress = ((currentChordIndex + 1) / chords.length) * 100;

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-200 space-y-5 p-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        Chord Progression Lesson
      </h1>

      {/* Progress Bar */}
      <div className="w-64 bg-gray-300 h-3 rounded-full overflow-hidden">
        <div
          className="bg-sky-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="text-xl font-medium text-gray-700">{chord.name}</h2>

      <GuitarChordDiagram
        chordName={chord.name}
        positions={chord.positions}
        stringStates={stringStates}
      />

      {/* Instruction Messages */}
      {lessonStage === "single" && (
        <div className="text-md text-gray-700 font-medium">
          🎵 Play string {currentStringIndex + 1} (
          {chord.strings[currentStringIndex]})
        </div>
      )}
      {lessonStage === "strum" && (
        <div className="text-md text-green-700 font-semibold">
          ✅ Great! Now strum the full chord.
        </div>
      )}
      {lessonStage === "next" && (
        <div className="text-md text-green-700 font-semibold">
          ✅ Chord complete! Click next to continue.
        </div>
      )}
      {lessonStage === "done" && (
        <div className="text-md text-green-700 font-semibold">
          🎉 Lesson complete! Great job.
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {!listening && lessonStage !== "done" && (
          <Button
            onClick={startListening}
            disabled={!essentiaReady}
            className="bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50"
          >
            {essentiaReady ? "Start Lesson" : "Loading..."}
          </Button>
        )}

        {/* ✅ Manual Skip for Testing */}
        {lessonStage === "single" && (
          <Button
            onClick={() => {
              if (currentStringIndex < 5) {
                setCurrentStringIndex((prev) => prev + 1);
              } else {
                setLessonStage("strum");
              }
            }}
            className="bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500"
          >
            Skip String →
          </Button>
        )}

        {lessonStage === "strum" && (
          <Button
            onClick={handleStrumDetected}
            className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
          >
            Mark Strum Complete 🎶
          </Button>
        )}

        {lessonStage === "next" && (
          <Button
            onClick={nextChord}
            className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
          >
            Next Chord →
          </Button>
        )}

        {lessonStage === "done" && (
          <Button
            onClick={() => router.push("/")}
            className="bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600"
          >
            Finish Lesson
          </Button>
        )}

      </div>
    </div>
  );
}

