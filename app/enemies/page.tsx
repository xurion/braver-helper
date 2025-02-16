"use client";

import enemies from "@/game/www/data/Enemies.json";

const invalidEnemyNames = ["TEST", "--", "SwapZeruhn Mines"].join("|");

const isValidEnemy = (enemyName: string) => {
  return !enemyName.match(invalidEnemyNames);
};

export default function Enemies() {
  return (
    <ul>
      {enemies
        .sort((a, b) =>
          a == null || b == null ? 0 : a.name.localeCompare(b.name)
        )
        .map(
          (enemy) =>
            enemy &&
            isValidEnemy(enemy.name) && (
              <li key={enemy.id}>
                <a href={`enemies/${enemy.id}`}>{enemy.name}</a>
              </li>
            )
        )}
    </ul>
  );
}
