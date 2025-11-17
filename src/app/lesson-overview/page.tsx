"use server";

import React from "react";
import LessonOverview from "./lesson";
import { caller } from "@/server/api/server";
import { Lesson } from "@prisma/client";
import { z } from "zod";
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function page() {

    const chordList = ["A", "Em", "G", "C", "D", "Am", "F", "B7"] as const;
    const ChordSchema = z.enum(chordList);
    const userPreferences = {
        //connect prefs here
    }

    const Lesson = z.object({
        title: z.string(),
        // chords: z.string(), //change to look at the chords
        
        chords: z.array(ChordSchema),
        description: z.array(z.string()),
        expDuration: z.int()
    });

    const prompt = {
        task: "",
        userPreference: userPreferences
    }
    //figure out how to show the most recent lesson, hard-coded input will be changed 
    // let lesson: Lesson = await caller.lesson.getLesson('00000000-0000-0000-0000-000000000002');

    // Send request to OpenAI to generate Lesson
    const openAiResponse = await client.chat.completions.create({
      response_format: zodResponseFormat(Lesson, "lesson"),
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate a lesson for a single chord or a chord progression for guitar. The description should be very short and concise, summarizing what chords will be taught.',
        },
        {
          role: 'user',
          content: JSON.stringify(prompt),
        },
      ],
    });

    const rawContent = openAiResponse.choices[0]?.message?.content;
    if (!rawContent) {
        console.error("NO response content")
    //   return NextResponse.json({ error: 'No response content from OpenAI' }, { status: 500 });
    }

    let lesson;
    try {
      lesson = JSON.parse(rawContent);
    } catch (e) {
        console.error(e)
    //   return NextResponse.json({ error: 'Failed to parse JSON from OpenAI' }, { status: 500 });
    }

    const validated = Lesson.safeParse(lesson);

    if (!validated.success) {
    //   return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        console.error("Failed to generate Lesson format")
    }

    return(
        <LessonOverview lesson={lesson}/>
    )
}

