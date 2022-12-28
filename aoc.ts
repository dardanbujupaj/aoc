import { ensureFile } from "https://deno.land/std@0.170.0/fs/mod.ts";

const BASE_URL = "https://adventofcode.com";

export const getInput = async (day: number, year: number) => {
  const cachePath = `.input/${year}_${day.toString().padStart(2, "0")}.txt`;

  try {
    return await Deno.readTextFile(cachePath);
  } catch (_error) {
    console.log("Download input...");
    const response = await fetch(`${BASE_URL}/${year}/day/${day}/input`, {
      headers: { Cookie: `session=${Deno.env.get("AOC_SESSION")}` },
    });

    const input = await response.text();

    await ensureFile(cachePath);
    await Deno.writeTextFile(cachePath, input, {});

    return input;
  }
};
