"use client";

import React, { useState, useEffect, useRef } from "react";
import GuitarChordDiagram from "./guitar-chord-diagram";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
// import { chords as chords2 } from "@tombatossals/chords-db";
import chords from "~/utils/guitar"
import { getFret, fretToList, getChordName } from "~/utils/chord-db-utils"
// console.log(chords)
// console.log(chords.chords.C[2].positions[0].frets)

const standard_tuning = ["E2", "A2", "D3", "G3", "B3", "E4"]

export default function LessonActivity({ lesson }: {lesson: any}) {

  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [lessonStage, setLessonStage] = useState<
    "single" | "strum" | "next" | "done"
  >("single");
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [stringStates, setStringStates] = useState<string[]>(
    Array(6).fill("neutral")
  );
  const [essentiaReady, setEssentiaReady] = useState(false);
  const [listening, setListening] = useState(false);
  const router = useRouter();

  // 🔁 refs so the audio loop sees fresh state
  const chordIndexRef = useRef(currentChordIndex);
  const lessonStageRef = useRef(lessonStage);
  const stringIndexRef = useRef(currentStringIndex);

  useEffect(() => {
    chordIndexRef.current = currentChordIndex;
  }, [currentChordIndex]);

  useEffect(() => {
    lessonStageRef.current = lessonStage;
  }, [lessonStage]);

  useEffect(() => {
    stringIndexRef.current = currentStringIndex;
  }, [currentStringIndex]);

  // ✅ Load Essentia.js dynamically
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

    console.log(
      "✅ Essentia loaded algorithms:",
      essentia.algorithmNames.slice(0, 10)
    );
    if (!essentia.HPCP) {
      console.error(
        "HPCP not found — check that Essentia WASM version supports tonal features."
      );
    } else {
      console.log(" HPCP available — ready for chord analysis.");
    }

    console.log(" Starting mic...");
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

      const chord = lesson.chords[chordIndexRef.current];
      const fret = getFret(chord.key, chord.suffix)
      const positions = fretToList(fret)
      let stringIndex = stringIndexRef.current;
      const stage = lessonStageRef.current;

      // 🔸 base state: everything neutral, current string = active (yellow)
      const updated = Array(6).fill("neutral") as string[];

      // 🧹 skip muted strings (positions === null)
      if (stage === "single") {
        while (
          stringIndex < 6 &&
          positions[stringIndex] === null
        ) {
          console.log(`🎸 Skipping muted string ${stringIndex + 1}`);
          stringIndex += 1;
        }

        // if we skipped to/past the end, go to strum phase
        if (stringIndex >= 6) {
          setLessonStage("strum");
          lessonStageRef.current = "strum";
          setStringStates(Array(6).fill("neutral"));
          requestAnimationFrame(detect);
          return;
        }

        // sync state + ref with possibly updated stringIndex
        if (stringIndex !== stringIndexRef.current) {
          stringIndexRef.current = stringIndex;
          setCurrentStringIndex(stringIndex);
        }

        updated[stringIndex] = "active"; // yellow current string
        setStringStates(updated);

        // 🎵 Single-string pitch detection
        const pitchData = essentia.PitchYin(audioVector);

        let pitch = 0;
        let confidence = 0;

        if (Array.isArray(pitchData)) {
          pitch = pitchData[0];
          confidence = pitchData[1];
        } else if (pitchData && typeof pitchData === "object") {
          pitch = pitchData.pitch ?? 0;
          confidence = pitchData.pitchConfidence ?? 0;
        }

        if (confidence > 0.7 && pitch > 40 && pitch < 600) {
          const expectedPitch = chord.expectedFreqs[stringIndex];
          const tolerance = 3;

          if (Math.abs(pitch - expectedPitch) < tolerance) {
            // ✅ Correct pitch → green
            updated[stringIndex] = "correct";
          } else {
            // ❌ Wrong pitch → red
            updated[stringIndex] = "incorrect";
          }
          setStringStates([...updated]);

          if (updated[stringIndex] === "correct") {
            // advance to next playable string
            let nextIndex = stringIndex + 1;
            while (
              nextIndex < 6 &&
              positions[nextIndex] === null
            ) {
              nextIndex += 1;
            }

            if (nextIndex < 6) {
              stringIndexRef.current = nextIndex;
              setCurrentStringIndex(nextIndex);
            } else {
              console.log("🎵 All single strings done! Proceed to strum.");
              setLessonStage("strum");
              lessonStageRef.current = "strum";
              setStringStates(Array(6).fill("neutral"));
            }
          }
        }
      }

      // 🎶 Strum detection using HPCP
      if (stage === "strum") {
        const spectrum = essentia.Spectrum(audioVector);
        const hpcpVector = essentia.HPCP(spectrum);
        const hpcpArray = essentia.vectorToArray(hpcpVector);
        const chordDetected = analyzeHPCP(hpcpArray, chord.name);
        if (chordDetected.confidence > 0.7) {
          console.log(`✅ Full chord recognized as ${chordDetected.chord}`);
          setLessonStage("next");
          lessonStageRef.current = "next";
        }
      }

      requestAnimationFrame(detect);
    };

    detect();
  }

  // 🔍 Helper for HPCP Chord Matching
  function analyzeHPCP(hpcpArray: number[], currentChord: string) {
    const templates: Record<string, number[]> = {
      "C Major": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
      "G Major": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
      "A Minor": [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    };

    const expected = templates[currentChord];
    if (!expected) return { chord: "Unknown", confidence: 0 };

    const dot = hpcpArray.reduce((sum, v, i) => sum + v * expected[i], 0);
    const magA = Math.sqrt(hpcpArray.reduce((s, v) => s + v ** 2, 0));
    const magB = Math.sqrt(expected.reduce((s, v) => s + v ** 2, 0));
    const confidence = dot / (magA * magB);

    return { chord: currentChord, confidence };
  }

  const nextChord = () => {
    if (currentChordIndex < lesson.chords.length - 1) {
      const nextIndex = currentChordIndex + 1;
      setCurrentChordIndex(nextIndex);
      chordIndexRef.current = nextIndex;

      setLessonStage("single");
      lessonStageRef.current = "single";

      setCurrentStringIndex(0);
      stringIndexRef.current = 0;

      setStringStates(Array(6).fill("neutral"));
    } else {
      setLessonStage("done");
      lessonStageRef.current = "done";
      setListening(false);
    }
  };

  const chord = lesson.chords[chordIndexRef.current];
  console.log(chord)
  const positions = fretToList(getFret(chord.key, chord.suffix))
  const progress = ((currentChordIndex + 1) / lesson.chords.length) * 100;

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
        chordName={getChordName(chord.key, chord.suffix)}
        positions={positions}
        stringStates={stringStates}
      />

      {/* Instruction Messages */}
      {lessonStage === "single" && (
        <div className="text-md text-gray-700 font-medium">
          🎵 Play string {currentStringIndex + 1} (
          {standard_tuning[currentStringIndex]})
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

        {lessonStage === "single" && (
          <Button
            onClick={() => {
              // manual skip for testing
              let nextIndex = currentStringIndex + 1;

              while (
                nextIndex < 6 &&
                positions[nextIndex] === null
              ) {
                nextIndex += 1;
              }

              if (nextIndex < 6) {
                setCurrentStringIndex(nextIndex);
                stringIndexRef.current = nextIndex;
              } else {
                setLessonStage("strum");
                lessonStageRef.current = "strum";
              }
            }}
            className="bg-white text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:bg-yellow-500"
          >
            Skip String →
          </Button>
        )}

        {lessonStage === "strum" && (
          <Button
            onClick={() => {
              setLessonStage("next");
              lessonStageRef.current = "next";
            }}
            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-orange-500"
          >
            Skip Strum →
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
            onClick={() => router.push("/lesson-history")}
            className="bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600"
          >
            Finish Lesson
          </Button>
        )}
      </div>
    </div>
  );
}
