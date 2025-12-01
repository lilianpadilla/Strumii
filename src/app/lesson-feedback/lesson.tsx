"use client";

import { useState, useEffect } from "react"; 
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card"; 
import { Card } from "~/components/ui/card"; 
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button"
import { Lesson } from "@prisma/client";

export default function LessonFeedback({lesson}: {lesson: Lesson }) {
     const [text, setText] = useState("") 

    function handleButton() {
        console.log("The User prompted: " + text)
        setText("")
        //regenerate a new lesson and display the newly generated lesson
    }

     return ( 
        <div className="mx-auto h-full flex flex-col w-[90%] justify-center gap-2 pt-5">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Lesson Finished!</CardTitle>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardContent>Chords go here</CardContent>
                    <CardContent>{lesson.description}</CardContent> 
                    <CardContent>{lesson.expDuration} Minutes</CardContent> 
                </CardHeader>
            </Card>
            <div className ="flex flex-row justify-center gap-1 p-5">
                <Button className="bg-red-500">D:</Button>
                <Button className="bg-orange-500">);</Button>
                <Button className="bg-yellow-500">|:</Button>
                <Button className="bg-green-500">(:</Button>
                <Button className="bg-[#93CAD7]">:D</Button>
            </div>
            <div className="flex flex-col flex-1">
            <Textarea className="bg-gray-200 h-50 mt-5 resize-none" value={text} onChange={(e) => setText(e.target.value)} placeholder="Lesson Feedback? This can help me give you better lesson suggestions"></Textarea>
            </div>
            <Button onClick={handleButton} className="bg-[#93CAD7] hover:bg-[#6a96a1]">Next Lesson</Button>
        </div>
        )}