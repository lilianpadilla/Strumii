"use server";

import React from "react";
import { caller } from "@/server/api/server";
import { Lesson } from "@prisma/client";
import LessonFeedback from "./lesson";


export default async function page() {
    //figure out how to show the chosen lesson, hard-coded INPUT will be changed 
    let lesson: Lesson = await caller.lesson.getLesson('00000000-0000-0000-0000-000000000002');

   return (
    <LessonFeedback lesson = {lesson}/>
   ) 
}
