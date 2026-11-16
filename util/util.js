import fs from "fs";
import os from "os";
import path from "path";
import { Jimp } from "jimp";

export async function filterImageFromURL(inputURL) {
  try {
    // Download/read the public image
    const photo = await Jimp.read(inputURL);

    // Resize using Jimp 1.x syntax
    photo.resize({
      w: 256,
      h: 256
    });

    // Convert to grayscale
    photo.greyscale();

    // Create a platform-independent temporary path
    const outpath = path.join(
      os.tmpdir(),
      `filtered.${Math.floor(Math.random() * 2000)}.jpg`
    );

    // Save filtered image
    await photo.write(outpath);

    return outpath;

  } catch (error) {
    console.error("Image filtering error:", error);
    throw error;
  }
}

export async function deleteLocalFiles(files) {
  for (const file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}