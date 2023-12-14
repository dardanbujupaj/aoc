import { getInput } from "@/lib/aoc";
import { Grid } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 14;

const SAMPLE_INPUT = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;
const SAMPLE_SOLUTION_PART_1 = 136;
const SAMPLE_SOLUTION_PART_2 = 64;

function rotate<T>(grid: Grid<T>) {
  const newGrid = new Grid<T>(
    grid.height,
    grid.width,
    Array.from({ length: grid.width * grid.height }),
  );
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      newGrid.set({ x: grid.height - y - 1, y: x }, grid.get({ x, y }));
    }
  }

  return newGrid;
}

function parseInput(input: string) {
  const lines = input.trim().split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const data = lines.flatMap((line) => line.trim().split(""));
  return new Grid<"O" | "#" | ".">(width, height, data as any);
}

function calculateLoad(grid: Grid<"O" | "#" | ".">) {
  let force = 0;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const cell = grid.get({ x, y });
      switch (cell) {
        case "O": {
          force += grid.height - y;
          break;
        }
      }
    }
  }

  return force;
}

function tiltNorth(grid: Grid<"O" | "#" | ".">) {
  const newGrid = new Grid<"O" | "#" | ".">(
    grid.width,
    grid.height,
    Array.from({ length: grid.width * grid.height }, () => "." as any),
  );

  let offsets = Array.from({ length: grid.width }, () => 0);

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const cell = grid.get({ x, y });
      switch (cell) {
        case "O": {
          newGrid.set({ x, y: offsets[x] }, "O");

          offsets[x] += 1;
          break;
        }
        case "#": {
          newGrid.set({ x, y }, "#");
          offsets[x] = y + 1;
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  return newGrid;
}

function part1(input: string) {
  const grid = parseInput(input);

  return calculateLoad(tiltNorth(grid));
}

function part2(input: string) {
  let grid = parseInput(input);

  const states: string[] = [grid.toString()];

  for (let i = 1; i <= 1_000_000_000; i++) {
    for (let d = 0; d < 4; d++) {
      grid = tiltNorth(grid);
      grid = rotate(grid);
    }

    const state = grid.toString();
    const existingIndex = states.indexOf(state);

    if (existingIndex !== -1) {
      console.log(`${existingIndex} repeats at ${i}`);
      const cycle = i - existingIndex;
      const targetIndex = existingIndex + ((1_000_000_000 - i) % cycle);

      grid = parseInput(states[targetIndex]);

      break;
    } else {
      states.push(state);
    }
  }

  return calculateLoad(grid);
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
