import { parse } from "path";
import { getInput } from "../lib/aoc";

const SAMPLE_INPUT = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

type YellNumber = {
  number: number;
};
type YellResult = {
  operation: "+" | "-" | "*" | "/";
  firstOperand: string;
  secondOperand: string;
};

type Job = YellNumber | YellResult;

function parseInput(input: string) {
  return new Map(
    input
      .trim()
      .split("\n")
      .map((line) => {
        const [name, job] = line.split(": ");
        return [name, job];
      }),
  );
}

const OPERATION_REGEX = /([a-z]+) ([\=\+\-\*\/]) ([a-z]+)/;

function parseMonkeyExpression(
  expression: string,
  monkeys: Map<string, string>,
): string {
  const operationMatch = expression.match(OPERATION_REGEX);

  if (operationMatch) {
    const [_, firstOperand, operator, secondOperand] = operationMatch;
    return `(${parseMonkeyExpression(
      monkeys.get(firstOperand)!,
      monkeys,
    )} ${operator} ${parseMonkeyExpression(
      monkeys.get(secondOperand)!,
      monkeys,
    )})`;
  } else {
    return expression;
  }
}

function part1(input: string) {
  const monkeys = parseInput(input);
  console.log(eval(parseMonkeyExpression(monkeys.get("root")!, monkeys)));
}

function calculateError(humn: number, expression: string) {
  const [left, right] = expression
    .replace("humn", humn.toString())
    .slice(1, -1) // remove external brackets
    .split(" = ");
  return eval(left) - eval(right);
}

function part2(input: string) {
  const monkeys = parseInput(input);
  const expression = parseMonkeyExpression(
    monkeys.get("root")!.replace(/[\=\+\-\*\/]/, "="),
    monkeys,
  ).replace(monkeys.get("humn")!, "humn");

  // linear interpolation
  const step = 10000000000; // we need a large enough step to mitigate flating point errors...
  const error0 = calculateError(0, expression);
  const error1 = calculateError(step, expression);
  const diff = error1 - error0;
  const humn = (step / diff) * -error0;

  return Math.round(humn);
}

console.log(part1(await getInput(21, 2022)));
console.log(part2(await getInput(21, 2022)));
