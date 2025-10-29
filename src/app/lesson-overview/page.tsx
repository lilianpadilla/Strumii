"use server";

import React from "react";
import { Button } from "~/components/ui/button";
import LessonOverview from "./lesson";


export default async function page() {
    return(
        <LessonOverview />
    )
}

