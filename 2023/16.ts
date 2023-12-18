import { getInput } from "@/lib/aoc";
import { Grid } from "@/lib/grid";
import { isAssertionError, time } from "@/lib/util";
import { Vector, add, mirror } from "@/lib/vector";
import { equal } from "assert";
import { isNativeError } from "util/types";

const YEAR = 2023;
const DAY = 16;

const SAMPLE_INPUT = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;
const SAMPLE_SOLUTION_PART_1 = 46;
const SAMPLE_SOLUTION_PART_2 = 51;

function parseInput(input: string) {
  return Grid.parse<typeof SAMPLE_INPUT>(input as any);
}

function part1(input: string) {
  const grid = parseInput(input);

  return energiseGrid(grid, { x: -1, y: 0 }, { x: 1, y: 0 });
}

function part2(input: string) {
  const grid = parseInput(input);

  let maxEnergy = 0;

  for (let x = 0; x < grid.width; x++) {
    maxEnergy = Math.max(
      energiseGrid(grid, { x, y: -1 }, { x: 0, y: 1 }),
      maxEnergy,
    );
    maxEnergy = Math.max(
      energiseGrid(grid, { x, y: grid.height }, { x: 0, y: -1 }),
      maxEnergy,
    );
  }

  for (let y = 0; y < grid.height; y++) {
    maxEnergy = Math.max(
      energiseGrid(grid, { x: -1, y }, { x: 1, y: 0 }),
      maxEnergy,
    );
    maxEnergy = Math.max(
      energiseGrid(grid, { x: grid.width, y }, { x: -1, y: 0 }),
      maxEnergy,
    );
  }

  return maxEnergy;
}

function energiseGrid(
  grid: ReturnType<typeof parseInput>,
  position: Vector,
  direction: Vector,
) {
  const energyGrid = Grid.withInitialValue(grid.width, grid.height, 0);

  let visitedBeams = new Set<string>();

  let beams: { position: Vector; direction: Vector }[] = [
    {
      position,
      direction,
    },
  ];

  while (beams.length > 0) {
    const nextBeams: typeof beams = [];

    for (const beam of beams) {
      const key = JSON.stringify(beam);

      if (visitedBeams.has(key)) {
        continue;
      }
      visitedBeams.add(key);

      const nextPosition = add(beam.position, beam.direction);
      if (!grid.contains(nextPosition)) {
        continue;
      }

      const nextElement = grid.get(nextPosition);
      energyGrid.set(nextPosition, energyGrid.get(nextPosition) + 1);

      switch (nextElement) {
        case ".": {
          nextBeams.push({ position: nextPosition, direction: beam.direction });
          break;
        }
        case "|": {
          if (beam.direction.x !== 0) {
            nextBeams.push(
              { position: nextPosition, direction: { x: 0, y: -1 } },
              { position: nextPosition, direction: { x: 0, y: 1 } },
            );
          } else {
            nextBeams.push({
              position: nextPosition,
              direction: beam.direction,
            });
          }
          break;
        }
        case "\\": {
          nextBeams.push({
            position: nextPosition,
            direction: mirror(beam.direction, { x: 1, y: -1 }),
          });
          break;
        }
        case "-": {
          if (beam.direction.y !== 0) {
            nextBeams.push(
              { position: nextPosition, direction: { x: -1, y: 0 } },
              { position: nextPosition, direction: { x: 1, y: 0 } },
            );
          } else {
            nextBeams.push({
              position: nextPosition,
              direction: beam.direction,
            });
          }
          break;
        }
        case "/": {
          nextBeams.push({
            position: nextPosition,
            direction: mirror(beam.direction, { x: 1, y: 1 }),
          });
          break;
        }
      }
    }
    beams = nextBeams;
  }

  return energyGrid.data.filter((x) => x >= 1).length;
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
