import { NextResponse } from "next/server";
import path from "path";
import { Jimp as jimp } from "jimp";

const ICON_SIZE = 32;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Next needs us to await this, even though it does not look awaitable
    const { id } = await params;

    if (!id) {
      throw new Error("No image ID provided");
    }

    const iconId = parseInt(id);
    const spritePath = path.join(
      process.cwd(),
      "game",
      "www",
      "img",
      "tbc",
      "IconSet.png"
    );
    const sprite = await jimp.read(spritePath);
    const columnCount = sprite.width / ICON_SIZE;
    const x = (iconId % columnCount) * ICON_SIZE;
    const y = Math.floor(iconId / columnCount) * ICON_SIZE;
    const clone = sprite.clone();
    const icon = clone.crop({ x, y, w: ICON_SIZE, h: ICON_SIZE });
    const imageBuffer = await icon.getBuffer("image/png");

    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    if (error instanceof RangeError) {
      console.error(
        "Error generating sprite image. Were the provided x, y, w and h values correct?",
        error
      );

      // Use 404 here instead of 400 because the requested image in the sprite does not exist
      return NextResponse.json({ error }, { status: 404 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
