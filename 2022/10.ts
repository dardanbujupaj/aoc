import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { getInput } from "../lib/aoc.ts";

const input = await getInput(10, 2022);

const parseInput = (input: string) => {
  let currentValue = 1;
  const values = input
    .split("\n")
    .flatMap((line) => {
      if (line.startsWith("addx")) {
        const [, value] = line.split(" ");
        return [0, parseInt(value)];
      } else {
        return [0];
      }
    })
    .map((value) => (currentValue += value));

  // add a 1 as first value to take into account that value changes after cycle
  return [1, ...values];
};

const part_1 = (input: string) => {
  const values = parseInput(input);
  let signal = 0;
  for (let i = 20; i <= 220; i += 40) {
    signal += values[i - 1] * i;
  }
  return `${signal}`;
};

const part_2 = (input: string) => {
  const values = parseInput(input);

  const output = values.map((value, index) => {
    const position = index % 40;
    return Math.abs(position - value) <= 1 ? "#" : ".";
  });

  let display = "\n";
  // render display
  for (let i = 0; i < 6; i++) {
    display += output.slice(i * 40, i * 40 + 40).join("") + "\n";
  }

  return display;
};

console.log(`Part 1: ${part_1(input)}`);
console.log(`Part 2: ${part_2(input)}`);

const TEST_INPUT = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

Deno.test("Test part 1", () => {
  assertEquals(part_1(TEST_INPUT), "13140");
});

Deno.test("Test part 2", () => {
  assertEquals(
    part_2(TEST_INPUT),
    `
##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`
  );
});
