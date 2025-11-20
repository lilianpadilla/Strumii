"use client";

import { useState, useEffect } from "react"; 
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card"; 
import { Card } from "~/components/ui/card"; 
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button"
import { Lesson } from "./types"
import { trpc } from '~/server/api/client';
import { useAuth } from "~/providers/AuthProvider"
// import { Lesson } from "@prisma/client";

export default function LessonOverview({lesson}: {lesson: Lesson }) {
    const { profile } = useAuth()
    const [text, setText] = useState("") 
    const createLesson = trpc.lesson.createLesson.useMutation();


    function handleButton() {
        console.log("The User prompted: " + text)
        setText("")
        //regenerate a new lesson and display the newly generated lesson
    }

    async function handleStartButton() {
        //button should write lesson into database
        console.log(profile.id)
        const lesson = await createLesson.mutateAsync({
            profileId: profile.id,
            title: "hello",
            description: "desc",
            chords: ["A", "C"],
            expDuration: 5,
        });
        console.log(lesson)
        //should direct user to lesson activity for new lesson
    }

     return ( 
        <div className="mx-auto flex flex-col w-[90%] justify-center gap-2 pt-5">
            <Card>
                <CardHeader>
                    <CardTitle>{lesson.title}</CardTitle>
                    {/*Iterate through each chord*/}
                    <CardContent>
                        {lesson.chords.map((chord, index) => (
                            <span key={chord.key + chord.suffix}>
                                {chord.key} {chord.suffix}
                                {index < lesson.chords.length - 1 ? ' | ' : ''}
                            </span>
                        ))}
                    </CardContent>
                    <CardContent>{lesson.description}</CardContent> 
                    <CardContent>{lesson.expDuration} Minutes</CardContent> 
                </CardHeader>
            </Card>
            <Button onClick={handleStartButton} className="bg-[#93CAD7] hover:bg-[#6a96a1]">Start Lesson!</Button>
            <Textarea className="bg-gray-200 mt-12 resize-none" value={text} onChange={(e) => setText(e.target.value)} placeholder="Have a suggestion? Let me know!"></Textarea>
            <Button onClick={handleButton} className="bg-[#93CAD7] hover:bg-[#6a96a1]">Suggest</Button>
        </div>
        )
    }