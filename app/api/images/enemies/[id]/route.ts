import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

    // Build the absolute path to the image file in the www/img folder
    const imagePath = path.join(
      process.cwd(),
      "game",
      "www",
      "img",
      "sv_enemies",
      `${id}.png`
    );

    const imageBuffer = await fs.readFile(imagePath);
    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Unable to fetch enemy image", error);
    return NextResponse.json({ error }, { status: 404 });
  }
}
