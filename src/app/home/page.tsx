"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#93CAD7] via-white to-[#93CAD7] text-white">
      {/* Decorative Background Circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#93CAD7] rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div className="absolute w-72 h-72 bg-[#93CAD7] rounded-full blur-3xl bottom-20 right-10 animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
        <span className="text-black">Meet</span>{" "}
        <span className="text-[#93CAD7]">Strumii</span>
      </h1>

      <p className="text-lg sm:text-xl text-black mb-8">
        An AI powered music learning tool that adapts to your pace, skill level, and busy sechedule.
      </p>

      <div className="flex gap-4 justify-center">
        <Link href="/auth/login">
          <Button
            size="lg"
            className="bg-[#93CAD7] hover:bg-[##76a5b0] text-white shadow-lg shadow-[#93CAD7]"
          >
            Start Learning
          </Button>
        </Link>
      </div>

      <img
        src="/logo.png"
        alt="Strumii Mascot"
        className="relative z-10 mx-auto w-64 h-auto drop-shadow-xl mt-10"
/>
    </div>
  );
}
