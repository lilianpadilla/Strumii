"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // optional helper for conditional classes (if you have it)

export default function PreferencesCard() {
  const [selectedSkillLevel, setSelectedSkillLevel] = React.useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedLessonLength, setSelectedLessonLength] = React.useState<string | null>(null);

  const genres = ["Rock", "Pop", "Blues", "Jazz", "Country"];

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  }

  return (
    <Card className="w-full max-w-md bg-white text-black rounded-2xl shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Account Preferences</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Skill Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Skill Level</Label>
          <RadioGroup onValueChange={setSelectedSkillLevel} className="flex justify-between">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Genre (Multi-Select Toggles) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preferred Music Genres</Label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                  selectedGenres.includes(genre)
                    ? "bg-[#93CAD7] text-black "
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Length */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preferred Lesson Length</Label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setSelectedLessonLength(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select length
            </option>
            <option value="1">Learn 1 Chord</option>
            <option value="2">Learn 2 Chords</option>
            <option value="3">Learn 3 Chords</option>
            <option value="4">Learn 4 Chords</option>
          </select>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          className="bg-black text-white hover:bg-[#93CAD7] rounded-xl px-6 py-2 font-medium"
          onClick={() =>
            console.log({
              selectedSkillLevel,
              selectedGenres,
              selectedLessonLength,
            })
          }
        >
          Update Now
        </Button>
      </CardFooter>
    </Card>
  );
}
