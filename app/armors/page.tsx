"use client";

import armors from "@/game/www/data/Armors.json";

// Filters out anything containing "--" as well as "-Foo-"
const invalidArmorNameRegExp = /^--|-[\s\S]+?-$/;

const isValidArmor = (armorName: string) => {
  return !armorName.match(invalidArmorNameRegExp);
};

export default function Armors() {
  return (
    <ul>
      {armors
        .sort((a, b) =>
          a == null || b == null ? 0 : a.name.localeCompare(b.name)
        )
        .map(
          (armor) =>
            armor &&
            isValidArmor(armor.name) && (
              <li key={armor.id}>
                <a href={`/armors/${armor.id}`}>{armor.name}</a>
              </li>
            )
        )}
    </ul>
  );
}
