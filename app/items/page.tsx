"use client";

import items from "@/game/www/data/Items.json";

// Filters out anything containing "--" as well as "-Foo-"
const invalidItemNameRegExp = /^--|-[\s\S]+?-$/;

const isValidItem = (itemName: string) => {
  return !itemName.match(invalidItemNameRegExp);
};

export default function Items() {
  return (
    <ul>
      {items
        .sort((a, b) =>
          a == null || b == null ? 0 : a.name.localeCompare(b.name)
        )
        .map(
          (item) =>
            item &&
            isValidItem(item.name) && (
              <li key={item.id}>
                <a href={`/items/${item.id}`}>{item.name}</a>
              </li>
            )
        )}
    </ul>
  );
}
