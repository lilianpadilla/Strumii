"use server";

import React from "react";
import LessonOverview from "./lesson";
import { caller } from "@/server/api/server";
import { Lesson } from "@prisma/client";
import { z } from "zod";
//import OpenAI from 'openai';

export default async function page() {

    const Lesson = z.object({
        title: z.string(),
        description: z.array(z.string()),
        exp_duration: z.int()
    });

    const Response = z.object({
        questions: z.array(Lesson)
    })

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    //figure out how to show the most recent lesson, hard-coded input will be changed 
    // let lesson: Lesson = await caller.lesson.getLesson('00000000-0000-0000-0000-000000000002');

    // Send request to OpenAI to generate Lesson
    const openAiResponse = await client.chat.completions.create({
      response_format: zodResponseFormat(Response, "question"),
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that only outputs valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
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

    // const validated = Response.safeParse(lesson);

    // if (!validated.success) {
    // //   return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    //     console.error(e)
    // }

    return(
        <LessonOverview lesson={lesson}/>
    )
}

