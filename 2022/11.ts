import assert from "assert";
import { getInput } from "@/lib/aoc";

const input = await getInput(11, 2022);

function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

class Monkey {
  inspections = 0;
  items: number[] = [];
  operation: string;
  test: number;
  trueTarget: number;
  falseTarget: number;

  constructor(input: string) {
    const lines = input.split("\n");
    this.items = lines[1]
      .split(":")[1]
      .split(", ")
      .map((v) => parseInt(v));
    this.operation = lines[2].split(":")[1].replace("new", "worry");
    this.test = parseInt(lines[3].trim().split(" ")[3]);
    this.trueTarget = parseInt(lines[4].trim().split(" ")[5]);
    this.falseTarget = parseInt(lines[5].trim().split(" ")[5]);
  }

  turn(monkeys: Monkey[], reduceWorry: boolean) {
    const commonMultiple = monkeys.reduce(
      (acc, curr) => lcm(acc, curr.test),
      1,
    );
    while (this.items.length > 0) {
      this.inspections++;

      const old = this.items.shift();
      let worry = 0;
      eval(this.operation);
      if (reduceWorry) {
        worry = Math.floor(worry / 3);
      } else {
        worry = worry % commonMultiple;
      }
      const target =
        worry % this.test == 0 ? this.trueTarget : this.falseTarget;

      monkeys[target].items.push(worry);
    }
  }
}

const parseInput = (input: string) =>
  input.split("\n\n").map((description) => new Monkey(description));

const part_1 = (input: string) => {
  const monkeys = parseInput(input);

  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {
      monkey.turn(monkeys, true);
    }
  }

  return monkeys
    .sort((a, b) => a.inspections - b.inspections)
    .reverse()
    .slice(0, 2)
    .reduce((accumulator, current) => accumulator * current.inspections, 1)
    .toString();
};

const part_2 = (input: string) => {
  const monkeys = parseInput(input);

  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {
      monkey.turn(monkeys, false);
    }
  }

  return monkeys
    .sort((a, b) => a.inspections - b.inspections)
    .reverse()
    .slice(0, 2)
    .reduce((accumulator, current) => accumulator * current.inspections, 1)
    .toString();
};

const TEST_INPUT = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

assert.equal(part_1(TEST_INPUT), "10605");
console.log(`Part 1: ${part_1(input)}`);

assert.equal(part_2(TEST_INPUT), "2713310158");
console.log(`Part 2: ${part_2(input)}`);
