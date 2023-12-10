import { getInput } from "@/lib/aoc";
import { Grid, get4Neighbours } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { Vector, add, angle, equals, subtract } from "@/lib/vector";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 10;

const SAMPLE_INPUT = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ` as const;
const SAMPLE_SOLUTION_PART_1 = 8;
const SAMPLE_SOLUTION_PART_2 = 10;

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];

type Tile = Exclude<Split<typeof SAMPLE_INPUT, "">[number], "\n">;

function parseInput(input: string) {
  const lines = input.trim().split("\n");

  const width = lines[0].length;
  const height = lines.length;

  const data = lines.flatMap((line) => line.split("") as Tile[]);

  const grid = new Grid(width, height, data);

  const startOffset = data.findIndex((value) => value === "S");
  const start: Vector = {
    x: startOffset % width,
    y: Math.floor(startOffset / width),
  };

  return {
    start,
    grid,
  };
}

function getNeighbours(grid: Grid<Tile>, position: Vector): Vector[] {
  switch (grid.get(position)) {
    case "S":
      return get4Neighbours(position)
        .filter((n) => grid.contains(n))
        .filter((n) => getNeighbours(grid, n).find((v) => equals(v, position)));
    case "J":
      return [
        { x: position.x - 1, y: position.y },
        { x: position.x, y: position.y - 1 },
      ].filter((n) => grid.contains(n));
    case "F":
      return [
        { x: position.x + 1, y: position.y },
        { x: position.x, y: position.y + 1 },
      ].filter((n) => grid.contains(n));
    case "L":
      return [
        { x: position.x, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
      ].filter((n) => grid.contains(n));
    case "7":
      return [
        { x: position.x, y: position.y + 1 },
        { x: position.x - 1, y: position.y },
      ].filter((n) => grid.contains(n));
    case "-":
      return [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
      ].filter((n) => grid.contains(n));
    case "|":
      return [
        { x: position.x, y: position.y - 1 },
        { x: position.x, y: position.y + 1 },
      ].filter((n) => grid.contains(n));
    default:
      return [];
  }
}

function getLoopTiles(grid: Grid<Tile>, start: Vector) {
  const visited: Vector[] = [];
  const stack = [start];

  while (stack.length > 0) {
    const current = stack.shift()!;

    if (visited.find((v) => equals(v, current))) {
      continue;
    }

    visited.push(current);

    const neighbours = getNeighbours(grid, current);

    stack.unshift(...neighbours);
  }
  return visited;
}

function part1(input: string) {
  const { start, grid } = parseInput(input);

  return getLoopTiles(grid, start).length / 2;
}

function part2(input: string) {
  const { grid, start } = parseInput(input);
  const loop = getLoopTiles(grid, start);

  function validTile(tile: Vector) {
    return grid.contains(tile) && !loop.find((l) => equals(l, tile));
  }

  const queue = loop
    .flatMap((tile, index) => {
      const previous = loop[index ? index - 1 : loop.length - 1];
      const next = loop[(index + 1) % loop.length];

      let insideTiles: Vector[] = [];

      let direction = subtract(previous, tile);
      direction = { x: -direction.y, y: direction.x };

      while (angle(direction) !== angle(subtract(next, tile))) {
        insideTiles.push(add(tile, direction));

        direction = { x: -direction.y, y: direction.x };
      }

      return insideTiles;
    })
    .filter(validTile);

  const visited: Vector[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.find((v) => equals(v, current))) {
      continue;
    }

    visited.push(current);

    const neighbours = get4Neighbours(current).filter(validTile);

    queue.push(...neighbours);
  }

  for (let y = 0; y < grid.height; y++) {
    let line = "";
    for (let x = 0; x < grid.width; x++) {
      const tile = { x, y };
      if (equals(tile, start)) {
        line += "S";
      } else if (loop.find((l) => equals(l, tile))) {
        line += visualTile(grid.get(tile));
      } else if (visited.find((v) => equals(v, tile))) {
        line += ".";
      } else {
        line += "x";
      }
    }
    console.log(line);
  }

  return visited.length;
}

function visualTile(tile: string) {
  switch (tile) {
    case "S":
      return "S";
    case "J":
      return "┘";
    case "F":
      return "┌";
    case "L":
      return "└";
    case "7":
      return "┐";
    case "-":
      return "─";
    case "|":
      return "│";
    default:
      return " ";
  }
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

  equal(
    part2(`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`),
    8,
  );

  equal(
    part2(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`),
    SAMPLE_SOLUTION_PART_2,
    "Part 2 sample wrong",
  );
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
