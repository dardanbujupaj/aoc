use aoc::client::get_input;
use regex::Regex;
use std::{error::Error, str::FromStr};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 5)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

#[derive(Debug)]
struct Cargo {
    stacks: Vec<Vec<char>>,
}

#[derive(Debug)]
enum CargoError {
    Regex(regex::Error),
}

impl From<regex::Error> for CargoError {
    fn from(error: regex::Error) -> Self {
        CargoError::Regex(error)
    }
}

impl FromStr for Cargo {
    type Err = CargoError;

    /// parse cargo from puzzle input
    /// example:
    ///     [D]    
    /// [N] [C]    
    /// [Z] [M] [P]
    ///  1   2   3
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut lines = s.lines().rev();

        let num_stacks = (lines.next().unwrap().chars().count() + 1) / 4;

        let mut stacks: Vec<Vec<char>> = vec![Vec::new(); num_stacks];

        lines.for_each(|l| {
            l.chars().skip(1).step_by(4).enumerate().for_each(|(i, c)| {
                if c != ' ' {
                    stacks.get_mut(i).unwrap().push(c)
                }
            })
        });

        Ok(Self { stacks })
    }
}

#[derive(Debug)]
struct Move {
    from: usize,
    to: usize,
    count: usize,
}

impl FromStr for Move {
    type Err = CargoError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let regex = Regex::new(r"^move (\d+) from (\d+) to (\d+)")?;
        let captures = regex.captures(s).unwrap();

        return Ok(Move {
            from: captures.get(2).unwrap().as_str().parse().unwrap(),
            to: captures.get(3).unwrap().as_str().parse().unwrap(),
            count: captures.get(1).unwrap().as_str().parse().unwrap(),
        });
    }
}

fn parse_input(input: &str) -> (Cargo, Vec<Move>) {
    let mut split = input.split("\n\n");

    return (
        Cargo::from_str(split.next().unwrap()).unwrap(),
        split
            .next()
            .unwrap()
            .lines()
            .map(|l| Move::from_str(l).unwrap())
            .collect(),
    );
}

fn part_1(input: &str) -> String {
    let (mut cargo, moves) = parse_input(input);

    for m in moves {
        for _ in 0..(m.count) {
            let item = cargo.stacks.get_mut(m.from - 1).unwrap().pop().unwrap();
            cargo.stacks.get_mut(m.to - 1).unwrap().push(item);
        }
    }

    cargo
        .stacks
        .iter_mut()
        .map(|stack| stack.pop().unwrap())
        .collect()
}

fn part_2(input: &str) -> String {
    let (mut cargo, moves) = parse_input(input);

    for m in moves {
        let from_stack = cargo.stacks.get_mut(m.from - 1).unwrap();

        let mut items = from_stack.split_off(from_stack.len() - m.count);
        cargo.stacks.get_mut(m.to - 1).unwrap().append(&mut items);
    }

    cargo
        .stacks
        .iter_mut()
        .map(|stack| stack.pop().unwrap())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "CMZ")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "MCD")
    }
}
