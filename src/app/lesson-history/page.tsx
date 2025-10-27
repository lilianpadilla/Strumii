"use server";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { caller } from "@/server/api/server"; 

export default async function Page() {

    let lessons = await caller.lesson.getLesson();
    console.log(lessons);

    return (
        <>
            <div className="flex flex-col w-full gap-y-5 items-center h-[80vh]">
                {/* <div className ="fixed top-0 z-20 flex flex-col w-full items-center justify-center p-5 bg-[#93CAD7] text-3xl text-white shadow-lg">
                    <h1><b>Lesson History</b></h1>
                </div> */}
                {/* <LessonDashboard/> */}
                <div className = "flex flex-wrap w-full gap-x-5 items-center justify-center gap-y-3 mt-24">
                    <b>Sort By:</b>
                <Select>
                    <SelectTrigger className="w-1/12 min-w-[200px]">
                        <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Newest">Newest</SelectItem>
                            <SelectItem value="Oldest">Oldest</SelectItem>
                            <SelectItem value="Most Confident">Most Confident</SelectItem>
                            <SelectItem value="Least Confident">Least Confident</SelectItem>
                            <SelectItem value="Shortest">Shortest</SelectItem>
                            <SelectItem value="Longest">Longest</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <b>Exclude Completed Lessons</b>
                <Switch />
                 </div>
                 <Card className= "w-15/16 bg-[#93CAD7] text-white shadow">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription className="text-white">Time Played:</CardDescription>
                        <CardDescription className="text-white">Lessons Completed:</CardDescription>
                        <CardDescription className="text-white">Songs Learned:</CardDescription>
                        </CardHeader>
                </Card>
                { /* to do: make the card change color depending on the confidence level of the lesson, if completed, do strumii blue! */ }
                 <div className ="flex flex-col w-7/8 justify-center gap-3 pb-10">
                 {lessons.map((lesson) => (
                  <Card
                    key = {lesson.id}
                    className={`cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100 ${ lesson.completed ? 'bg-[#93CAD7]' : '' }`}
                    >
                      <CardHeader className="w-full">
                        <CardTitle>{lesson.title}</CardTitle>
                        <CardDescription>{lesson.description} </CardDescription>
                        <CardDescription>Started: { lesson.createdAt.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', year: 'numeric', month: '2-digit', day: '2-digit', hour12: true}) } | 
                            Completed: {lesson.completed ? /*{ lesson.createdAt.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', year: 'numeric', month: '2-digit', day: '2-digit', hour12: true}) }*/ 'Yes' : 'No'}
                        </CardDescription>
                        <CardDescription>{ lesson.expDuration } Minutes</CardDescription>
                      </CardHeader>
                    </Card>
                 ))}
                    <a href="https://media.tenor.com/aSkdq3IU0g0AAAAM/laughing-cat.gif" className="block">
                    <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100 bg-orange-500 text-white">
                        <CardHeader>
                            <CardTitle>Chord Progression: Em - D - C - B</CardTitle>
                            <CardDescription className="text-white-500">03-13-2025 : 2:12PM</CardDescription>
                            <CardDescription className="text-white-500">10 Minute Lesson</CardDescription>
                            <CardDescription className="text-white-500"><b>Review: Not Confident</b></CardDescription>
                            </CardHeader>
                    </Card></a>
                    <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100 bg-[#93CAD7] text-white">
                        <div className="flex items-center justify-between">
                        <CardHeader className="w-full"> 
                            <CardTitle>Chord: Em</CardTitle>
                            <CardDescription className="text-white-500">03-13-2025 : 2:12PM</CardDescription>
                            <CardDescription className="text-white-500">5 Minute Lesson</CardDescription>
                            <CardDescription className="text-white-500"><b>Review: Completed!</b></CardDescription>
                        </CardHeader>
                            <div className="pr-5">
                                <img src="/logo.png" alt=""/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}