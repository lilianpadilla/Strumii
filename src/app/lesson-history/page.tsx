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
import { Button } from "~/components/ui/button";

export default async function Page() {

    return (
        <>
            <div className="flex flex-col w-full gap-y-5 items-center h-[80vh]">
                <div className ="fixed top-0 z-20 flex flex-col w-full items-center justify-center p-5 bg-[#93CAD7] text-3xl text-white shadow-lg">
                    <h1><b>Lesson History</b></h1>
                </div>
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
                 <Card className= "w-full bg-[#93CAD7] text-white shadow">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription className="text-white">Time Played:</CardDescription>
                        <CardDescription className="text-white">Lessons Completed:</CardDescription>
                        <CardDescription className="text-white">Songs Learned:</CardDescription>
                        </CardHeader>
                </Card>
                 <div className ="w-7/8 justify-center">
                {/* make this a preset component later? */}
                <a href="https://media.tenor.com/aSkdq3IU0g0AAAAM/laughing-cat.gif" className="block">
                <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100">
                    <CardHeader>
                        <CardTitle>Chord Progression: Em - D - C - B</CardTitle>
                        <CardDescription>03-13-2025 : 2:12PM</CardDescription>
                        <CardDescription>10 Minute Lesson</CardDescription>
                        <CardDescription className="text-blue-500"><b>Review: Confident</b></CardDescription>
                        </CardHeader>
                </Card></a>
                <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100">
                    <CardHeader>
                        <CardTitle>Chord Progression: Em - D - C - B</CardTitle>
                        <CardDescription>03-13-2025 : 2:12PM</CardDescription>
                        <CardDescription>10 Minute Lesson</CardDescription>
                        <CardDescription className="text-red-500"><b>Review: Not Confident</b></CardDescription>
                        </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100">
                    <CardHeader>
                        <CardTitle>Chord: B</CardTitle>
                        <CardDescription>03-13-2025 : 2:12PM</CardDescription>
                        <CardDescription>5 Minute Lesson</CardDescription>
                        <CardDescription className="text-yellow-500"><b>Review: Could Use Practice</b></CardDescription>
                        </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg hover:scale-103 transition-transform duration-100 bg-[#93CAD7] text-white">
                    <CardHeader>
                        <CardTitle>Chord: Em</CardTitle>
                        {/* there HAS to be a better way to do this (maybe parameter?) */}
                        <CardDescription className="text-white-500">03-13-2025 : 2:12PM</CardDescription>
                        <CardDescription className="text-white-500">5 Minute Lesson</CardDescription>
                        <CardDescription className="text-white-500"><b>Review: Confident</b></CardDescription>
                        </CardHeader>
                </Card>
                </div>
            </div>
        </>
    )
}