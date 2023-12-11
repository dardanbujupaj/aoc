import { getInput } from "@/lib/aoc";
import { isAssertionError, time } from "@/lib/util";
import { Vector, manhatten } from "@/lib/vector";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 11;

const SAMPLE_INPUT = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;
const SAMPLE_SOLUTION_PART_1 = 374;
const SAMPLE_SOLUTION_PART_2 = -1;

function remove<T>(array: T[], element: T) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function parseInput(input: string, expansion = 2) {
  const lines = input.trim().split("\n")
  const width = lines[0].length
  const height = lines.length

  const emptyColumns = Array.from({ length: width }, (_, index) => index)
  const emptyRows = Array.from({ length: height }, (_, index) => index)

  const galaxies: Vector[] = []

  lines.flatMap(line => line.split(""))
    .forEach((character, index) => {
      const x = index % width
      const y = Math.floor(index / width)
      if (character === "#") {
        galaxies.push({ x, y })

        remove(emptyColumns, x)
        remove(emptyRows, y)
      }
    })

  galaxies.forEach(galaxy => {
    galaxy.x += emptyColumns.filter(values => values < galaxy.x).length * (expansion - 1)
    galaxy.y += emptyRows.filter(values => values < galaxy.y).length * (expansion - 1)
  })

  return galaxies
}

function part1(input: string) {
  const data = parseInput(input);

  let distances = 0

  for (let a = 0; a < data.length; a++) {
    const galaxyA = data[a]
    for (let b = a + 1; b < data.length; b++) {
      const galaxyB = data[b]
      const distance = manhatten(galaxyA, galaxyB)

      distances += distance
    }
  }


  return distances;
}

function part2(input: string) {
  const data = parseInput(input, 1_000_000);

  let distances = 0

  for (let a = 0; a < data.length; a++) {
    const galaxyA = data[a]
    for (let b = a + 1; b < data.length; b++) {
      const galaxyB = data[b]
      const distance = manhatten(galaxyA, galaxyB)

      distances += distance
    }
  }


  return distances;
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log(`${time(() => part1(input), "Part 1")}`);

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
