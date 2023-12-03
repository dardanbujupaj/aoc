use aoc::client::get_input;
use std::{collections::HashSet, error::Error};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 3)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

const ITEMS: &str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

fn part_1(input: &str) -> String {
    let value = input
        .lines()
        .map(|l| -> usize {
            let (left, right) = l.split_at(l.chars().count() / 2);
            let left_set = HashSet::<char>::from_iter(left.chars());
            let right_set = HashSet::<char>::from_iter(right.chars());

            let value = left_set
                .intersection(&right_set)
                .map(|c| ITEMS.find(*c).unwrap() + 1)
                .sum();

            value
        })
        .sum::<usize>();

    format!("{value}")
}

fn part_2(input: &str) -> String {
    let lines = input.lines();

    let mut sum = 0;

    for i in 0..lines.count() / 3 {
        sum += input
            .lines()
            .skip(i * 3)
            .take(3)
            .map(|l| HashSet::<char>::from_iter(l.chars()))
            .reduce(|a, b| a.intersection(&b).copied().collect::<HashSet<char>>())
            .unwrap()
            .iter()
            .map(|c| ITEMS.find(*c).unwrap() + 1)
            .sum::<usize>();
    }

    format!("{sum}")
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "157")
    }
    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "70")
    }
}
