"use server";

import { caller } from "@/server/api/server"; 

import LessonActivity from "./activity";

export default async function Page({ params }: { params: Promise<{ lessonId: string }> }) {

    const { lessonId } = await params
    // console.log(lessonId)

  let lesson = await caller.lesson.getLesson(lessonId);
  // console.log(lesson)

  lesson.chords = lesson.chords.map((c) => {return JSON.parse(c)})
  // console.log(lesson)


  return (
    <>
      <LessonActivity lesson={lesson}/>
    </>
  )
}