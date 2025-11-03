"use client";

import { useState, useEffect } from "react"; 
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card"; 
import { Card } from "~/components/ui/card"; 
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button"

export default function LessonOverview() {
     const [text, setText] = useState("") 

    function handleButton() {
        console.log("The User prompted: " + text)
        setText("")
    }

     return ( 
        <div className="mx-auto flex flex-col w-[90%] justify-center gap-2 pt-5">
            <Card>
                <CardHeader>
                    <CardTitle>Lesson title goes here! </CardTitle>
                    <CardContent>Chords go here</CardContent>
                    <CardContent>desc goes here!</CardContent> 
                    <CardContent>time estimate goes here!</CardContent> 
                </CardHeader>
            </Card>
            <Button className="bg-[#93CAD7] hover:bg-[#6a96a1]">Start Lesson!</Button>
            <Textarea className="bg-gray-200 mt-12 resize-none" value={text} onChange={(e) => setText(e.target.value)} placeholder="Have a suggestion? Let me know!"></Textarea>
            <Button onClick={handleButton} className="bg-[#93CAD7] hover:bg-[#6a96a1]">Suggest</Button>
        </div>
        )
    }