"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import items from "@/game/www/data/Items.json";
import "./items.css";

export default function Item() {
  const params = useParams();
  // const router = useRouter();

  if (!params.id) {
    return <p>Item not found</p>;
  }

  const itemId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id);
  const item = items[itemId];

  if (item === null) {
    return <p>Item not found</p>;
  }

  return (
    <div className="item-wrapper">
      <h1>{item.name}</h1>

      <Image
        src={`/api/images/items/${item.iconIndex}`}
        alt={item.name}
        width="64"
        height="64"
        className="item-image"
      />

      <p className="item-description">{item.description}</p>
    </div>
  );
}
