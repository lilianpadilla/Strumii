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
        <div className="mx-auto flex flex-col w-[90%] justify-center gap-2">
            <Card>
                <CardHeader> Lesson Description </CardHeader>
                <CardContent> 
                    This lesson will teach you the E chord. One of the fundamental and simple chords to learn guitar. This is to get you started in guitar playing!
                </CardContent> 
            </Card>
            <Button>Start Lesson!</Button>
            <Textarea className="bg-gray-200 mt-12" value={text} onChange={(e) => setText(e.target.value)} placeholder="Have a suggestion? Let me know!"></Textarea>
            <Button onClick={handleButton}>Suggest</Button>
        </div>
        )
    }