"use server";

import React from "react";
import LessonOverview from "./lesson";
import { caller } from "@/server/api/server";
import { Lesson, Profile } from "@prisma/client";
import { z } from "zod";
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";

import suffixes from "~/utils/guitar/suffixes";
import keys from "~/utils/guitar/keys"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export default async function page() {
  const profile = await caller.profile.getProfile();
  let prefs = await caller.profile.getUserPreferences({id: profile?.userPreferencesId!});
    
    const ChordKeySchema = z.enum(keys);
    const SuffixSchema = z.enum(suffixes);

    const Chord = z.object({
      key: ChordKeySchema,
      suffix: SuffixSchema,
    })

    const Lesson = z.object({
        title: z.string(),
        chords: z.array(Chord),
        description: z.array(z.string()),
        expDuration: z.int()
    });

    const prompt = {
        task: "Generate a lesson for a single chord or a chord progression for guitar. The description should be very short and concise, take into consideration the length suggested.",
        userPreference: prefs
    }
    // Send request to OpenAI to generate Lesson
    const openAiResponse = await client.chat.completions.create({
      response_format: zodResponseFormat(Lesson, "lesson"),
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
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

    console.log(lesson)

    return(
        <LessonOverview lesson={lesson}/>
    )
}

