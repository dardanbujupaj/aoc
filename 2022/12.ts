import assert from "assert";
import { getInput } from "../lib/aoc";
import { Grid, Point } from "../lib/grid";

const input = (await getInput(12, 2022)).trim();

type Cell = {
  height: number;
  distance?: number;
};

const parseInput = (input: string) => {
  const lines = input.split("\n");

  let start: Point;
  let end: Point;

  const data = lines
    .flatMap((l) => l.split(""))
    .map((c, index): Cell => {
      switch (c) {
        case "S":
          // high enough to enter any height
          start = getPointForDataIndex(index, lines[0].length);
          return {
            height: "a".charCodeAt(0),
          };
        case "E":
          // low enough to be entered by any height
          end = getPointForDataIndex(index, lines[0].length);
          return {
            height: "z".charCodeAt(0),
          };
        default:
          return {
            height: c.charCodeAt(0),
          };
      }
    });

  return [new Grid(lines[0].length, lines.length, data), start!, end!] as const;
};

const getPointForDataIndex = (index: number, width: number) => {
  return {
    x: index % width,
    y: Math.floor(index / width),
  };
};

const part_1 = (input: string) => {
  const [grid, start, end] = parseInput(input);
  console.log(
    `Find shortest path from ${JSON.stringify(start)} to ${JSON.stringify(end)}`
  );

  grid.get(start).distance = 0;

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const queue = [start];

  while (queue.length > 0) {
    const currentPoint = queue.shift()!;
    const currentCell = grid.get(currentPoint);

    for (const direction of directions) {
      const point = {
        x: currentPoint.x + direction.x,
        y: currentPoint.y + direction.y,
      };

      if (grid.contains(point)) {
        const cell = grid.get(point);
        if (cell.height <= currentCell.height + 1 && !cell.distance) {
          cell.distance = currentCell.distance! + 1;
          if (point.x === end.x && point.y === end.y) {
            return `${cell.distance}`;
          }

          queue.push(point);
        }
      }
    }
  }
};

const part_2 = (input: string) => {
  const [grid, _, end] = parseInput(input);
  console.log(`Find shortest path from ${JSON.stringify(end)} to ???`);
  grid.get(end).distance = 0;

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const queue = [end];

  while (queue.length > 0) {
    const currentPoint = queue.shift()!;
    const currentCell = grid.get(currentPoint);

    for (const direction of directions) {
      const point = {
        x: currentPoint.x + direction.x,
        y: currentPoint.y + direction.y,
      };

      if (grid.contains(point)) {
        const cell = grid.get(point);
        if (cell.height >= currentCell.height - 1 && !cell.distance) {
          cell.distance = currentCell.distance! + 1;
          if (cell.height === "a".charCodeAt(0)) {
            return `${cell.distance}`;
          }

          queue.push(point);
        }
      }
    }
  }
};

const TEST_INPUT = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

assert.equal(part_1(TEST_INPUT), "31");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "29");
console.log(`Part 2: ${part_2(input)}`);
