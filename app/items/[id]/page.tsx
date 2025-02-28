"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

import items from "@/game/www/data/Items.json";
import styles from "./items.module.css";

type ColorMapping = {
  [key: string]: string;
};

// Define your mapping from colour references to actual colour values
const colorMapping: ColorMapping = {
  "4": "#27c7c7",
  "27": "purple",
};

function parseDescription(input: string): Array<React.ReactNode> {
  const regex = /\\c\[(\d+)\]([\s\S]+?)\\c|\\i\[(\d+)\]/g;
  const components: Array<React.ReactNode> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    // Push any plain text before the current match.
    if (match.index > lastIndex) {
      components.push(input.substring(lastIndex, match.index));
    }

    // Check which group was matched:
    if (match[1] && match[2]) {
      // Colour block: match[1] is the colour code, match[2] is the text.
      const colorCode = match[1];
      const text = match[2];
      const color = colorMapping[colorCode] || "black";

      components.push(
        <span style={{ color }} key={lastIndex}>
          {text}
        </span>
      );
    } else if (match[3]) {
      // Image tag: match[3] is the image reference.
      const imgRef = match[3];
      const src = `/api/images/items/${imgRef}`;

      if (src) {
        components.push(
          <Image
            src={src}
            alt={`Image ${imgRef}`}
            key={lastIndex}
            width="16"
            height="500"
            className={styles["description-icon"]}
          />
        );
      } else {
        // If no mapping exists, you might want to fallback to showing the original text.
        components.push(match[0]);
      }
    }

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last match.
  if (lastIndex < input.length) {
    components.push(input.substring(lastIndex));
  }

  return components;
}

export default function Item() {
  const params = useParams();

  if (!params.id) {
    return <p>Item not found</p>;
  }

  const itemId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);
  const item = items[itemId];

  if (item === null) {
    return <p>Item not found</p>;
  }

  const descriptions = parseDescription(item.description);

  return (
    <div className={styles["item-wrapper"]}>
      <h1>{item.name}</h1>

      <Image
        src={`/api/images/items/${item.iconIndex}`}
        alt={item.name}
        width="64"
        height="64"
        className={styles["item-image"]}
      />

      <p className={styles["item-description"]}>{...descriptions}</p>
    </div>
  );
}
