import { readFile, writeFile, mkdir } from "fs/promises";
import {} from "bun:sqlite";

const BASE_URL = "https://adventofcode.com";
const CACHE_DIR = ".input";

export const getInput = async (day: number, year: number) => {
  const cachePath = `${CACHE_DIR}/${year}_${day
    .toString()
    .padStart(2, "0")}.txt`;

  try {
    return await readFile(cachePath, { encoding: "utf-8" });
  } catch (_error) {
    console.log("Download input...");
    const response = await fetch(`${BASE_URL}/${year}/day/${day}/input`, {
      headers: { Cookie: `session=${process.env.AOC_SESSION}` },
    });

    if (!response.ok)
      throw Error(
        `Download failed: ${response.status} - ${response.statusText}`,
      );

    const input = await response.text();

    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cachePath, input);

    return input;
  }
};
