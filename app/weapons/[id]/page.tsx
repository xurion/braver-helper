"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import weapons from "@/game/www/data/Weapons.json";
import "./weapons.css";

function parseDescription(rawDescription: string) {
  const match = rawDescription.match(/([\s\S]+)\\c\[4\]([\s\S]*?)\\c/);

  if (match === null) {
    throw new Error("Unable to parse description");
  }

  const splitDescription = match[1].split("\n");
  const description = splitDescription[0];
  const level = splitDescription[1];
  const jobs = match[2];
  return { description, jobs, level };
}

export default function Weapon() {
  const params = useParams();
  // const router = useRouter();

  if (!params.id) {
    return <p>Weapon not found</p>;
  }

  const weaponId = parseInt(
    Array.isArray(params.id) ? params.id[0] : params.id
  );
  const weapon = weapons[weaponId];

  if (weapon === null) {
    return <p>Weapon not found</p>;
  }

  const { description, jobs, level } = parseDescription(weapon.description);

  return (
    <div className="weapon-wrapper">
      <h1>{weapon.name}</h1>

      <p className="weapon-level">
        {level} {weapon.etypeId}
      </p>

      <Image
        src={`/api/images/items/${weapon.iconIndex}`}
        alt={weapon.name}
        width="64"
        height="64"
        className="weapon-image"
      />
      <p className="weapon-description">{description}</p>

      {jobs && <p className="jobs">{jobs}</p>}
    </div>
  );
}
