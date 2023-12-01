import { Command } from "commander";
import { existsSync, mkdirSync } from "node:fs";

type Options = {
  year: number;
  day: number;
  watch: boolean;
};

const date = new Date();
const isDecember = date.getMonth() == 11;

const command = new Command()
  .name("bun aoc")
  .option(
    "-d, --day <day>",
    "Day of the puzzle",
    (v) => parseInt(v),
    date.getDate(),
  )
  .option(
    "-y, --year <year>",
    "Year of the puzzle",
    (v) => parseInt(v),
    isDecember ? date.getFullYear() : date.getFullYear() - 1,
  )
  .option("-w, --watch", "Watch file changes and rerun", false)
  .action(async (options: Options) => {
    const { year, day, watch } = options;

    const target = Bun.file(`${year}/${day.toString().padStart(2, "0")}.ts`);

    if (!(await target.exists())) {
      await initSolution(options);
    }

    Bun.spawn({
      cmd: ["bun", "run", watch ? "--watch" : "", `${year}/${day}.ts`],
      stdout: "inherit",
      stderr: "inherit",
    });
  });

command.parse();

async function initSolution({ day, year }: { day: number; year: number }) {
  if (!isValidPuzzleDate(year, day)) return false;

  const target = Bun.file(`${year}/${day.toString().padStart(2, "0")}.ts`);
  if (await target.exists()) {
    console.error(`File '${target.name}' already exists`);
    return false;
  }

  const template = await Bun.file("./template.ts").text();

  const solutionTemplate = template
    .replace("const DAY = 0", `const DAY = ${day}`)
    .replace("const YEAR = 0", `const YEAR = ${year}`);

  const folder = `${year}/`;
  if (!existsSync(folder)) {
    console.log(`Create folder '${folder}'`);
    mkdirSync(folder);
  }

  console.log(`Create file '${target.name}'`);

  await Bun.write(target, solutionTemplate);

  return true;
}

function isValidPuzzleDate(year: number, day: number) {
  if (
    !((isDecember && year === date.getFullYear()) || year < date.getFullYear())
  ) {
    console.error(`Puzzles for ${year} have not yet started`);
    return false;
  }

  if (year < 2015) {
    console.error(`No puzzles for year ${year}`);
    return false;
  }

  if (day < 1 || day > 25) {
    console.error(`${day}. is not a puzzle day`);
    return false;
  }

  if (isDecember && year === date.getFullYear() && day > date.getDate()) {
    console.error(`puzzle for ${day}. is not out yet`);
    return false;
  }

  return true;
}
