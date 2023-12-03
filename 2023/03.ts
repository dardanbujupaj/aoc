import { getInput } from "@/lib/aoc";
import { Grid } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { Vector } from "@/lib/vector";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 3;

const SAMPLE_INPUT = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
const SAMPLE_SOLUTION_PART_1 = 4361;
const SAMPLE_SOLUTION_PART_2 = 467835;

function parseInput(input: string) {
  const lines = input.trim().split("\n");
  const width = lines[0].length;
  const height = lines.length;

  const grid = new Grid(
    width,
    height,
    lines.flatMap((line) => line.split("")),
  );

  return grid.data
    .map((value, index, array) => {
      if (
        value.match(/\d/) &&
        (index % grid.width === 0 || !array[index - 1].match(/\d/))
      ) {
        const pos = {
          x: index % grid.width,
          y: Math.floor(index / grid.width),
        } satisfies Vector;
        if (grid.get(pos) !== value) {
          console.log("error");
        }
        return pos;
      }
    })
    .filter((value) => value !== undefined)
    .map((value) => {
      let digits = [];
      let symbol: Vector | undefined = undefined;
      let queue = [value];
      let visited: Vector[] = [];

      while (queue.length > 0) {
        const current = queue.shift();

        if (current === undefined) {
          throw new Error("Queue is empty"); // should never happen, but typescript 🤷
        }

        visited.push(current);

        const currentData = grid.get(current);
        if (currentData.match(/\d/)) {
          digits.push(currentData);
        } else if (currentData !== ".") {
          symbol = current;
          continue;
        } else {
          continue;
        }

        const neighbours = [
          { x: current.x - 1, y: current.y - 1 },
          { x: current.x, y: current.y - 1 },
          { x: current.x + 1, y: current.y - 1 },
          { x: current.x - 1, y: current.y },
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y + 1 },
          { x: current.x, y: current.y + 1 },
          { x: current.x + 1, y: current.y + 1 },
        ];

        neighbours.forEach((neighbour) => {
          if (
            grid.contains(neighbour) &&
            visited.find(
              (visited) =>
                visited.x === neighbour.x && visited.y === neighbour.y,
            ) === undefined
          ) {
            queue.push(neighbour);
          }
        });
      }

      return { number: parseInt(digits.join(""), 10), symbol };
    });
}

function part1(input: string) {
  return parseInput(input)
    .filter(({ symbol }) => symbol)
    .reduce((acc, { number }) => acc + number, 0);
}

function part2(input: string) {
  const data = parseInput(input).filter(({ symbol }) => symbol);

  // group by symbol position
  const grouped = data.reduce(
    (acc, { symbol, number }) => {
      if (symbol === undefined) {
        return acc;
      }

      const existing = acc.find((group) =>
        group.find(
          (item) => item.symbol.x === symbol.x && item.symbol.y === symbol.y,
        ),
      );
      if (existing) {
        existing.push({ symbol, number });
      } else {
        acc.push([{ symbol, number }]);
      }

      return acc;
    },
    [] as { symbol: Vector; number: number }[][],
  );

  return grouped
    .filter((group) => group.length === 2)
    .map((group) => {
      const [a, b] = group;
      return a.number * b.number;
    })
    .reduce((acc, value) => acc + value, 0);
}

console.log(`AOC ${DAY} - ${YEAR}\n`);

try {
  const input = await getInput(DAY, YEAR);

  equal(part1(SAMPLE_INPUT), SAMPLE_SOLUTION_PART_1, "Part 1 sample wrong");
  console.log("---");
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
