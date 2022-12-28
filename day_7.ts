import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { getInput } from "./aoc.ts";


const input = await getInput(7, 2022);

type Directory = {
  name: string;
  size: number;
  parent?: Directory;
  directories: Directory[];
};

const addFile = (directory: Directory, size: number, name: string) => {
  directory.size += size;
  directory.parent && addFile(directory.parent, size, name);
};


const parseInput = (input: string) => {
  const root: Directory = {
    name: "/",
    size: 0,
    directories: [],
  };

  let currentDirectory = root;

  input.split("$ ").forEach((command) => {
    if (command.startsWith("cd")) {
      // cd
      const [, dirname] = command.replaceAll("\n", "").split(" ");
      let nextDirectory;
      switch (dirname) {
        case "/":
          nextDirectory = root;
          break;
        case "..":
          nextDirectory = currentDirectory.parent;
          break;
        default:
          nextDirectory = currentDirectory.directories.find(
            (d) => d.name === dirname
          );
      }
      if (nextDirectory) {
        currentDirectory = nextDirectory;
      } else {
        throw new Error(`Directory not found: '${dirname}'`);
      }
    } else {
      // ls
      command
        .split("\n")
        .slice(1)
        .filter(s => s.length) // skip empty
        .forEach((entry) => {
          if (entry.startsWith("dir")) {
            const [, name] = entry.split(" ");
            currentDirectory.directories.push({
              name,
              parent: currentDirectory,
              size: 0,
              directories: [],
            });
          } else {
            const [size, name] = entry.split(" ")
            addFile(currentDirectory, parseInt(size), name)
          }
        });
    }
  });

  return root

}

const part_1 = (input: string) => {
  const root = parseInput(input)

  const queue = [];
  let size = 0;

  let current: Directory | undefined = root;
  while (current) {
    queue.push(...current.directories);

    if (current.size <= 100000) {
      size += current.size;
    }
    current = queue.pop();
  }

  return size.toString()
};

const part_2 = (input: string) => {
  const root = parseInput(input)

  const missingSpace = 30000000 - (70000000 - root.size)
  console.log("missing space ", missingSpace)

  const queue = [];

  let candidate = root

  let current: Directory | undefined = root;
  while (current) {
    queue.push(...current.directories);

    if (current.size >= missingSpace && current.size < candidate.size) {
      console.log(`new candidate: ${current.name}: ${current.size}`)
      candidate = current;
    }

    current = queue.pop();
  }

  return candidate.size.toString()
};

console.log(`Part 1: ${part_1(input)}`)
console.log(`Part 2: ${part_2(input)}`)


const TEST_INPUT = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

Deno.test("Test part 1", () => {
  assertEquals(part_1(TEST_INPUT), "95437");
});

Deno.test("Test part 2", () => {
  assertEquals(part_2(TEST_INPUT), "24933642");
});
