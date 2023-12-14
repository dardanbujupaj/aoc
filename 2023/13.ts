import { getInput } from "@/lib/aoc";
import { Grid } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 13;

const SAMPLE_INPUT = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;
const SAMPLE_SOLUTION_PART_1 = 405;
const SAMPLE_SOLUTION_PART_2 = 400;

function parseInput(input: string) {
  return input.trim().split("\n\n");
}

function difference(a: string, b: string) {
  let counter = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      counter++;
    }
  }

  return counter;
}

function findMirror(data: string[], smudge = 0) {
  outer: for (let i = 1; i < data.length; i++) {
    let counter = 0;
    for (let offset = 0; offset < Math.min(i, data.length - i); offset++) {
      //if (!equals(data[i - offset - 1], data[i + offset], smudge)) continue outer;
      counter += difference(data[i - offset - 1], data[i + offset]);

      if (counter > smudge) continue outer;
    }
    if (counter === smudge) return i;
  }

  return 0;
}

function part1(input: string) {
  const data = parseInput(input);
  return data
    .map((grid) => {
      const rows = grid.split("\n");
      const columns = Array.from({ length: rows[0].length }, (_, i) =>
        rows.map((row) => row[i]).join(""),
      );
      const rowMirror = findMirror(rows);
      const columnMirror = findMirror(columns);

      return 100 * rowMirror + columnMirror;
    })
    .reduce((a, b) => a + b, 0);
}

function part2(input: string) {
  const data = parseInput(input);
  return data
    .map((grid) => {
      const rows = grid.split("\n");
      const columns = Array.from({ length: rows[0].length }, (_, i) =>
        rows.map((row) => row[i]).join(""),
      );
      const rowMirror = findMirror(rows, 1);
      const columnMirror = findMirror(columns, 1);
      return 100 * rowMirror + columnMirror;
    })
    .reduce((a, b) => a + b, 0);
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

  equal(part2(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_2, "Part 2 sample wrong");
  console.log(`${time(() => part2(input), "Part 2")}`);
} catch (error: unknown) {
  if (isAssertionError(error)) {
    console.error(
      `${error.message} (expected ${error.expected}, got ${error.actual})`,
    );
  } else if (isNativeError(error)) {
    console.error(error.message);
  } else {
    console.log(error);
  }
}
