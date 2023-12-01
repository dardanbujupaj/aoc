import { range } from "@/lib/util";
import { Vector, add, angle, subtract } from "@/lib/vector";
import { equal } from "assert";
import { getInput } from "../lib/aoc";
import { Grid } from "../lib/grid";

const SAMPLE_INPUT = `        ...#    
        .#..    
        #...    
        ....    
...#.......#    
........#...    
..#....#....    
..........#.    
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const DIRECTIONS = ["right", "down", "left", "up"] as const;
type Direction = (typeof DIRECTIONS)[number];

type Cell = " " | "." | "#";

const CUBE_EDGES = [
  [
    { x: 50, y: 0 },
    { x: 50, y: 49 },
    { x: 0, y: 149 },
    { x: 0, y: 100 },
  ],
  [
    { x: 50, y: 50 },
    { x: 50, y: 99 },
    { x: 0, y: 100 },
    { x: 49, y: 100 },
  ],
  [
    { x: 0, y: 150 },
    { x: 0, y: 199 },
    { x: 50, y: 0 },
    { x: 99, y: 0 },
  ],
  [
    { x: 0, y: 199 },
    { x: 49, y: 199 },
    "down",
    { x: 100, y: 0 },
    { x: 150, y: 0 },
    "up",
  ],
  [
    { x: 99, y: 50 },
    { x: 99, y: 99 },
    { x: 100, y: 49 },
    { x: 150, y: 49 },
  ],
  [
    { x: 150, y: 0 },
    { x: 150, y: 49 },
    { x: 99, y: 149 },
    { x: 99, y: 100 },
  ],
  [
    { x: 49, y: 150 },
    { x: 49, y: 199 },
    { x: 50, y: 149 },
    { x: 99, y: 149 },
  ],
];

// TODO calculate warp map from edges
// Map<Vector, {target: Vector, rotation: ??}

function pointsOnLine(from: Vector, to: Vector) {
  const points: Vector[] = [];

  for (const y of range(from.y, to.y)) {
    for (const x of range(from.x, to.x)) {
      points.push({ x, y });
    }
  }

  return points;
}

type Warp = {
  target: Vector
  rotation: string
}

function createWarpMap(edges: typeof CUBE_EDGES) {
  const warpMap = new Map<string, Warp>()

  for (const [start1, end1, start2, end2] of edges) {

    const rotation = angle(subtract(end2, start2)) - angle(subtract(end1, start1))

    console.log(`${JSON.stringify(start1)} - ${JSON.stringify(end1)} -> ${JSON.stringify(start2)} - ${JSON.stringify(end2)}`)
    console.log(rotation)


    const segment1 = pointsOnLine(start1, end1)
    const segment2 = pointsOnLine(start2, end2)

    for (let i = 0; i < segment1.length; i++) {
      warpMap.set()
      
      

    }
  }
}

console.log(createWarpMap(CUBE_EDGES));

equal(part1(SAMPLE_INPUT), 6032);

const input = await getInput(22, 2022);

console.log(part1(input));

type MonkeyMap = ReturnType<typeof parseInput>["grid"];

function moveWithWarping(
  from: Vector,
  grid: MonkeyMap,
  direction: Direction,
  distance: number,
  warp: any
) {
  let moved = 0;
  let position = structuredClone(from);

  do {
    let nextPosition = position;

    if (grid.get(nextPosition) === ' ') {
      // warp
      
    }

    if (grid.get(nextPosition) !== "#") position = nextPosition;

    moved++;
  } while (moved < distance);

  return position;
}

function move(
  from: Vector,
  grid: MonkeyMap,
  direction: Direction,
  distance: number,
) {
  let moved = 0;
  let position = structuredClone(from);

  do {
    let nextPosition = position;
    do {
      nextPosition = add(nextPosition, direction2Vector(direction));
      if (nextPosition.x < 0) nextPosition.x += grid.width;
      if (nextPosition.x >= grid.width) nextPosition.x -= grid.width;
      if (nextPosition.y < 0) nextPosition.y += grid.height;
      if (nextPosition.y >= grid.height) nextPosition.y -= grid.height;
    } while (grid.get(nextPosition) === " ");

    if (grid.get(nextPosition) !== "#") position = nextPosition;

    moved++;
  } while (moved < distance);

  return position;
}

function rotate(direction: Direction, rotation: "L" | "R"): Direction {
  const currentIndex = DIRECTIONS.indexOf(direction);

  return DIRECTIONS[
    (currentIndex + (rotation === "L" ? 3 : 1)) % DIRECTIONS.length
  ];
}

function direction2Vector(direction: Direction): Vector {
  switch (direction) {
    case "right":
      return { x: 1, y: 0 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "up":
      return { x: 0, y: -1 };
  }
}

function part1(input: string) {
  const { grid, path } = parseInput(input);
  const outputGrid = new Grid(
    grid.width,
    grid.height,
    structuredClone(grid.data),
  );

  let position = { x: grid.data.indexOf("."), y: 0 };
  let direction = "right" as Direction;

  outputGrid.set(position, "r");
  for (const movement of path) {
    if (movement === "R" || movement === "L") {
      direction = rotate(direction, movement);
      // console.log(`new direction ${direction}`)
    } else {
      const dirVector = direction2Vector(direction);
      position = move(position, grid, direction, parseInt(movement));
    }
    outputGrid.set(position, direction[0]);
  }
  outputGrid.set(position, "x");

  // printGrid(outputGrid)

  return (
    (position.y + 1) * 1000 +
    (position.x + 1) * 4 +
    DIRECTIONS.indexOf(direction)
  );
}

function printGrid(grid: Grid<any>) {
  let output = "";
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      output += grid.get({ x, y });
    }
    output += "\n";
  }
  console.log(output);
}

function part2(input: string) {
  const grid = parseInput(input);
  return 0;
}

function parseInput(input: string) {
  const lines = input.split("\n").filter((l) => l);
  let gridLines = lines.slice(0, lines.length - 1);
  const width = gridLines.map((l) => l.length).reduce((a, b) => Math.max(a, b));
  gridLines = gridLines.map((l) => l.padEnd(width, " "));

  const directionsLine = lines[lines.length - 1];
  const height = gridLines.length;

  const data = gridLines.flatMap((line) => line.split(""));

  return {
    grid: new Grid(width, height, data),
    path: Array.from(directionsLine.matchAll(/\d+|(R|L)/g)).map((m) => m[0]),
  };
}
