import assert from "assert";
import { getInput } from "../lib/aoc";
import { manhatten, Vector } from "../lib/vector";

const input = await getInput(15, 2022);

class Area {
  center: Vector;
  extent: number;

  constructor(sensor: Vector, beacon: Vector) {
    this.center = sensor;
    this.extent = manhatten(sensor, beacon);
  }
}

const parseInput = (input: string) => {
  const regex =
    /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

  return input
    .trim()
    .split("\n")
    .map((line) => {
      const values = regex
        .exec(line)!
        .slice(1)
        .map((v) => parseInt(v));

      return new Area(
        { x: values[0], y: values[1] },
        { x: values[2], y: values[3] }
      );
    });
};

type Range = [number, number];

const overlaps = (a: Range, b: Range) => a[0] <= b[1] && a[1] >= b[0];

const part_1 = (input: string, offset = 2000000) => {
  const areas = parseInput(input);
  const scannedCount = areas
    .flatMap((area) => {
      const verticalDistance = Math.abs(area.center.y - offset);
      if (verticalDistance <= area.extent) {
        const remainingExtent = area.extent - verticalDistance;
        return [
          [
            area.center.x - remainingExtent,
            area.center.x + remainingExtent,
          ] as Range,
        ];
      }
      return [];
    })
    .reduce((previous, current) => {
      const ranges = [current];

      for (const range of previous) {
        if (overlaps(range, current)) {
          // combine ranges
          current[0] = Math.min(current[0], range[0]);
          current[1] = Math.max(current[1], range[1]);
        } else {
          ranges.push(range);
        }
      }
      return ranges;
    }, [] as Range[])
    .reduce((previous, current) => previous + current[1] - current[0], 0);

  return `${scannedCount}`;
};

const part_2 = (input: string, extent = 4_000_000) => {
  const areas = parseInput(input);
  for (let y = 0; y < extent; y++) {
    const row = [0, extent] as Range
    areas
      .flatMap((area) => {
        const verticalDistance = Math.abs(area.center.y - y);
        if (verticalDistance <= area.extent) {
          const remainingExtent = area.extent - verticalDistance;
          return [
            [
              area.center.x - remainingExtent,
              area.center.x + remainingExtent,
            ] as Range,
          ];
        }
        return [];
      })
      .sort((a, b) => a.0 - b.0)
      .reduce((previous, current) => {
        const ranges = [current];

        for (const range of previous) {
          if (overlaps(range, current)) {
            // combine ranges
            current[0] = Math.min(current[0], range[0]);
            current[1] = Math.max(current[1], range[1]);
          } else {
            ranges.push(range);
          }
        }
        return ranges;
      }, [] as Range[])
      .map((range) => {
        if (overlaps([0, extent], range)) {
          return [Math.max(range[0], 0), Math.min(range[1], extent)];
        }
      })
      .filter((r) => r)
      .forEach((r) => {
        const range = r!
        if (range[0] === row[0]) {
          row[0] = range[1]
        } else if (range[1] === row[1]) {
          row[1] = range[0]
        } else {
          console.log("???")
          console.log(range, row)
        }
      }) // this should not be needed after filter...
      if (row[0] === row[1]) {
        console.log(row)
      }
  }

  return `${0}`;
};

const TEST_INPUT = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

assert.equal(part_1(TEST_INPUT, 10), "26");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "");
console.log(`Part 2: ${part_2(input)}`);
