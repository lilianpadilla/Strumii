"use server";

import React from "react";
import LessonOverview from "./lesson";
import { caller } from "@/server/api/server";


export default async function page() {
    let lesson = await caller.lesson.getLesson();
    return(
        <LessonOverview />
    )
}

