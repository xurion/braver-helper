"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const JOBS = ["PLD", "PUP", "SAM"] as const;
type Job = (typeof JOBS)[number];

const SLOTS = [
  "Shield",
  "Head",
  "Body",
  "Arms",
  "Legs",
  "Belt",
  "Necklace",
  "Ring",
  "Earring",
  "Relic",
  "Instrument",
  "Grimoire",
  "Arrow",
  "Bullet",
  "Jug",
  "Mark",
  "Flair",
  "Grip",
  "Tools",
  "Focus",
  "Talisman",
  "Rune",
  "Ruby",
  "Automaton Head",
  "Automaton Frame",
] as const;
type Slot = (typeof SLOTS)[number];

function isJob(value: string): value is Job {
  return JOBS.includes(value as Job);
}

function isSlot(value: string): value is Slot {
  return SLOTS.includes(value as Slot);
}

export default function GearFinder() {
  const router = useRouter();
  const [level, setLevel] = useState(75);
  const [job, setJob] = useState<Job>(JOBS[0]);
  const [slot, setSlot] = useState<Slot>(SLOTS[0]);

  return (
    <>
      <input
        onChange={(e) => setLevel(Number(e.target.value))}
        placeholder="Level"
        value={level}
        type="number"
      />

      <select
        onChange={(e) => {
          if (!isJob(e.target.value)) {
            return;
          }

          setJob(e.target.value);
        }}
        value={job}
      >
        {JOBS.map((job, i) => (
          <option key={i} value={job}>
            {job}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          if (!isSlot(e.target.value)) {
            return;
          }

          setSlot(e.target.value);
        }}
        value={slot}
      >
        {SLOTS.map((slot, i) => (
          <option key={i} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <button
        onClick={() => router.push(`/gear-finder/${job}/${slot}/${level}`)}
      >
        Search
      </button>
    </>
  );
}
