"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

import enemies from "@/game/www/data/Enemies.json";
import items from "@/game/www/data/Items.json";
import armors from "@/game/www/data/Armors.json";
import weapons from "@/game/www/data/Weapons.json";
import "./enemies.css";

function parseEnemyNote(note: string) {
  const isInBestiary = note.includes("<book:no>") === false;
  const minLevel = note.match(/<Minimum Level: (\d+)>/)?.[1] || "??";
  const maxLevel = note.match(/<Maximum Level: (\d+)>/)?.[1] || "??";
  const dropsNode = note.match(/<Enemy Drops>([\s\S]*?)<\/Enemy Drops>/)?.[1];
  const drops = dropsNode
    ?.split("\n")
    .filter((drop) => drop)
    .map((drop) => {
      const matches = drop.match(/([\s\S]*?): (\d+)%/);
      return { name: matches?.[1], rate: matches?.[2] };
    });
  const descriptionNodes = Array.from(
    note.matchAll(/<desc(?:1|2):([\s\S]*?)>/g)
  );
  let description = descriptionNodes.map((node) => node[1]).join(" ");
  const zoneRegExp = /\\c\[\d+]\(([\s\S]*?)\)\\c\[\d+]/;
  const zone = description.match(zoneRegExp)?.[1];
  if (zone) {
    description = description.replace(zoneRegExp, "");
  }
  const steal = note.match(/<Steal ([\s\S]*?)>/)?.[1];

  return {
    description,
    drops,
    isInBestiary,
    minLevel,
    maxLevel,
    steal,
    zone,
  };
}

type Armor = NonNullable<(typeof armors)[number]>;
type Item = NonNullable<(typeof items)[number]>;
type Weapon = NonNullable<(typeof weapons)[number]>;

type GetItemDataArmorResult = {
  category: "armors";
  item: Armor;
};
type GetItemDataItemResult = {
  category: "items";
  item: Item;
};
type GetItemDataWeaponResult = {
  category: "weapons";
  item: Weapon;
};
type GetItemDataUnknownResult = {
  category: "unknown";
};
type GetItemDataResult =
  | GetItemDataArmorResult
  | GetItemDataItemResult
  | GetItemDataWeaponResult
  | GetItemDataUnknownResult;

function getItemData(itemName: string): GetItemDataResult {
  const fromItems = items.find((i) => i?.name === itemName);
  if (fromItems) {
    return { category: "items", item: fromItems };
  }

  const fromArmors = armors.find((i) => i?.name === itemName);
  if (fromArmors) {
    return { category: "armors", item: fromArmors };
  }

  const fromWeapons = weapons.find((i) => i?.name === itemName);
  if (fromWeapons) {
    return { category: "weapons", item: fromWeapons };
  }

  return { category: "unknown" };
}

export default function Enemy() {
  const params = useParams();
  const router = useRouter();

  if (!params.id) {
    throw new Error("No enemy ID provided");
  }

  const enemyId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);
  const enemy = enemies[enemyId];

  if (enemy === null) {
    throw new Error("Enemy is null");
  }

  const parsedNote = parseEnemyNote(enemy.note);

  return (
    <div className="enemy-wrapper">
      <h1>{enemy.name}</h1>

      <p className="enemy-level">
        Lv.{parsedNote.minLevel}
        {parsedNote.minLevel !== parsedNote.maxLevel
          ? ` - ${parsedNote.maxLevel}`
          : ""}
      </p>

      {parsedNote.description && (
        <p className="enemy-description">{parsedNote.description}</p>
      )}

      <Image
        src={`/api/images/enemies/${enemy.battlerName}`}
        alt={enemy.name}
        width="100"
        height="100"
        className="enemy-image"
      />

      <div className="section">
        <h2>Drops</h2>
        {parsedNote.drops ? (
          <ul className="items">
            {parsedNote.drops.map((drop, i) => {
              if (!drop.name) {
                return null;
              }

              const data = getItemData(drop.name);
              const { category } = data;

              if (category === "unknown") {
                return (
                  <li className="item" key={i}>
                    <Image
                      alt={drop.name}
                      className="item-image"
                      height="100"
                      src="/api/images/items/93"
                      width="100"
                    />
                    {drop.name} (unknown item)
                  </li>
                );
              }

              const { item } = data;
              const onClick = item
                ? () => router.push(`/${category}/${item.id}`)
                : undefined;
              return (
                <li className="item clickable" key={i} onClick={onClick}>
                  {item && (
                    <>
                      <Image
                        alt={item.name}
                        className="item-image"
                        height="100"
                        src={`/api/images/items/${item.iconIndex}`}
                        width="100"
                      />
                      {drop.name}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          "None"
        )}
        {enemy.gold > 0 && <div>Gil: {enemy.gold}</div>}
      </div>

      <div className="section">
        <h2>Steal</h2>

        {parsedNote.steal ? (
          <ul className="items">
            <li className="item">{parsedNote.steal}</li>
          </ul>
        ) : (
          "None"
        )}
      </div>

      <div className="section">
        <h2>Stats</h2>
        <ul className="stats">
          <li className="stat">
            <span className="key">HP:</span> {enemy.params[0]}
          </li>
          <li className="stat">
            <span className="key">MP:</span> {enemy.params[1]}
          </li>
          <li className="stat">
            <span className="key">STR:</span> {enemy.params[2]}
          </li>
          <li className="stat">
            <span className="key">VIT:</span> {enemy.params[3]}
          </li>
          <li className="stat">
            <span className="key">MND:</span> {enemy.params[5]}
          </li>
          <li className="stat">
            <span className="key">INT:</span> {enemy.params[4]}
          </li>
          <li className="stat">
            <span className="key">AGI:</span> {enemy.params[6]}
          </li>
          <li className="stat">
            <span className="key">LUK:</span> {enemy.params[7]}
          </li>
        </ul>
        <p className="text-xs">
          These base values are scaled up in game depending on level.
        </p>
      </div>

      <h2>Misc.</h2>
      <ul>
        <li>In bestiary: {parsedNote.isInBestiary ? "Yes" : "No"}</li>
        <li>Zone: {parsedNote.zone}</li>
      </ul>
    </div>
  );
}
