"use client";

import weapons from "@/game/www/data/Weapons.json";

// Filters out anything containing "--" as well as "-Foo-"
const invalidWeaponNameRegExp = /^--|-[\s\S]+?-$/;

const isValidWeapon = (weaponName: string) => {
  return !weaponName.match(invalidWeaponNameRegExp);
};

export default function Weapons() {
  return (
    <ul>
      {weapons
        .sort((a, b) =>
          a == null || b == null ? 0 : a.name.localeCompare(b.name)
        )
        .map(
          (weapon) =>
            weapon &&
            isValidWeapon(weapon.name) && (
              <li key={weapon.id}>
                <a href={`/weapons/${weapon.id}`}>{weapon.name}</a>
              </li>
            )
        )}
    </ul>
  );
}
