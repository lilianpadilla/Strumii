"use server";

import { caller } from "@/server/api/server"; 

import LessonActivity from "./activity";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {

    const { lessonId } = await params
    console.log(lessonId)

  // let lessons = await caller.lesson.getLesson();
  // console.log(lessons)

  let lesson = {
    chords: [
      {   
        key: "C",
        suffix: "major"
        // positions: [null, 3, 2, 0, 1, 0],
        // expectedFreqs: [82, 110.0, 146.83, 196.0, 246.94, 329.63],
        // strings: ["E", "A", "D", "G", "B", "e (high)"],
      },
      {
        key: "G",
        suffix: "major"
        // positions: [3, 2, 0, 0, 0, 3],
        // expectedFreqs: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0],
        // strings: ["E", "A", "D", "G", "B", "e (high)"],
      },
      {
        key: "A",
        suffix: "minor"
        // positions: [null, 0, 2, 2, 1, 0],
        // expectedFreqs: [82.41, 110.0, 146.83, 220.0, 261.63, 329.63],
        // strings: ["E", "A", "D", "G", "B", "e (high)"],
      },
    ]
  }

  return (
    <>
      <LessonActivity lesson={lesson}/>
    </>
  )
}