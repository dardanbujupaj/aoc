import { exit } from "process";

const date = new Date();
const isDecember = date.getMonth() == 11;
const year =
  parseInt(process.argv[3]) || isDecember
    ? date.getFullYear()
    : date.getFullYear() - 1;
const day =
  parseInt(process.argv[2]) ||
  (isDecember && date.getDate() <= 25 ? date.getDate() : undefined);

if (!day) {
  console.error("Invalid day");
  exit(127);
}

if (year < 2015 || year > date.getFullYear()) {
  console.error("Invalid year");
  exit(127);
}

const puzzleProcess = Bun.spawn({
  cmd: ["bun", "run", "--watch", `${year}/${day}.ts`],
  stdout: "inherit",
  stderr: "inherit",
});
