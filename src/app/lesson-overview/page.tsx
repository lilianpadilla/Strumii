"use server";

import React from "react";
import LessonOverview from "./lesson";
import { caller } from "@/server/api/server";
import { Lesson } from "@prisma/client";


export default async function page() {
    //figure out how to show the most recent lesson, hard-coded input will be changed 
    let lesson: Lesson = await caller.lesson.getLesson('00000000-0000-0000-0000-000000000002');
    return(
        <LessonOverview lesson={lesson}/>
    )
}

