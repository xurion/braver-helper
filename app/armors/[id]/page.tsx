"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import armors from "@/game/www/data/Armors.json";
import "./armors.css";

const GEAR_SLOT_REGEXP =
  /Arrow|Earring|Grip|Light Armor|Necklace|Relic|Ring|Tools/;

function parseDescription(rawDescription: string) {
  const strippedDescription = rawDescription.replace(GEAR_SLOT_REGEXP, "");
  const match = strippedDescription.match(/([\s\S]+)\\c\[4\]([\s\S]*?)\\c/);

  if (match === null) {
    throw new Error("Unable to parse description");
  }

  const splitDescription = match[1].split("\n");
  const description = splitDescription[0];
  const level = splitDescription[1];
  const jobs = match[2];
  return { description, jobs, level };
}

function getSlotName(eTypeId: number) {
  const SLOT_NAMES = [];
  SLOT_NAMES[2] = "Shield";
  SLOT_NAMES[3] = "Head";
  SLOT_NAMES[4] = "Body";
  SLOT_NAMES[5] = "Arms";
  SLOT_NAMES[6] = "Legs";
  SLOT_NAMES[7] = "Belt";
  SLOT_NAMES[8] = "Necklace";
  SLOT_NAMES[9] = "Ring";
  SLOT_NAMES[10] = "Earring";
  SLOT_NAMES[11] = "Relic";
  SLOT_NAMES[12] = "Instrument";
  SLOT_NAMES[13] = "Grimoire";
  SLOT_NAMES[14] = "Arrow";
  SLOT_NAMES[15] = "Bullet";
  SLOT_NAMES[16] = "Jug";
  SLOT_NAMES[17] = "Mark";
  SLOT_NAMES[18] = "Flair";
  SLOT_NAMES[19] = "Grip";
  SLOT_NAMES[20] = "Tools";
  SLOT_NAMES[21] = "Focus";
  SLOT_NAMES[22] = "Talisman";
  SLOT_NAMES[23] = "Rune";
  SLOT_NAMES[24] = "Ruby";
  SLOT_NAMES[25] = "Automaton Head";
  SLOT_NAMES[26] = "Automaton Frame";

  return SLOT_NAMES[eTypeId];
}

export default function Armor() {
  const params = useParams();
  // const router = useRouter();

  if (!params.id) {
    return <p>Armor not found</p>;
  }

  const armorId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);
  const armor = armors[armorId];

  if (armor === null) {
    return <p>Armor not found</p>;
  }

  const { description, jobs, level } = parseDescription(armor.description);

  return (
    <div className="armor-wrapper">
      <h1>{armor.name}</h1>

      <p className="armor-level">
        {level} {getSlotName(armor.etypeId)}
      </p>

      <Image
        src={`/api/images/items/${armor.iconIndex}`}
        alt={armor.name}
        width="64"
        height="64"
        className="armor-image"
      />
      <p className="armor-description">{description}</p>

      {jobs && <p className="jobs">{jobs}</p>}
    </div>
  );
}
