"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { getZodiac } from "@/lib/zodiac";
import { Meteors } from "@/components/ui/meteors";

// fallback motivational quotes
const fallbackQuotes = [
  "✨ Keep pushing forward, success is near!",
  "🌟 Stay positive, good things are coming.",
  "💪 Every challenge is a chance to grow.",
];

export default function LandingPage() {
  const { setTheme } = useTheme();
  const [employeeName, setEmployeeName] = useState("Employee");
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);

  useEffect(() => {
    // Simulate getting employee info (replace later with DB/session)
    const name = "Archie";
    const dob = "1994-10-07"; // YYYY-MM-DD

    setEmployeeName(name);

    // ✅ compute zodiac sign from dob
    const [_, monthStr, dayStr] = dob.split("-");
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const sign = getZodiac(month, day);
    setZodiac(sign);

    // ✅ fetch horoscope from API
    const fetchHoroscope = async () => {
      try {
        const res = await fetch(`/api/horoscope?zodiac=${sign}`);
        const data = await res.json();
        console.log("Frontend received:", data);

        if (data.horoscope) {
          setHoroscope(data.horoscope);
        } else {
          // fallback if API returns error
          const random =
            fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          setHoroscope("🌠 (Fallback) " + random);
        }
      } catch (err) {
        console.error("Error fetching horoscope:", err);
        const random =
          fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setHoroscope("🌠 (Offline) " + random);
      }
    };

    fetchHoroscope();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <Meteors number={30} className="text-indigo-400/60" />
      {/* top bar */}
      <div className="w-full flex justify-end p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* hero section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <section className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Hello,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {employeeName}
            </span>
            ! 👋
          </h1>

          {zodiac && (
            <p className="text-xl md:text-2xl leading-relaxed">
              Your horoscope today ({zodiac}):
            </p>
          )}

          <blockquote className="text-2xl md:text-3xl font-medium italic text-indigo-700 dark:text-indigo-300">
            {horoscope ? `“${horoscope}”` : "Loading your horoscope..."}
          </blockquote>

          <div className="pt-6">
            <Button size="lg" asChild>
              <a
                href="https://192.168.100.2:5001/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Proceed to NAS Login
              </a>
            </Button>
          </div>
        </section>
      </main>
      {/* footer */}
      <footer className="w-full py-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        Created by: <span className="font-semibold">Archie</span>
      </footer>
    </div>
  );
}
