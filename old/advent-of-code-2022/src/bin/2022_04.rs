use aoc::client::get_input;
use regex::Regex;
use std::{error::Error, ops::RangeInclusive};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 4)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

type RangePair = (RangeInclusive<usize>, RangeInclusive<usize>);

fn parse_input(input: &str) -> Vec<RangePair> {
    let regex = Regex::new(r"^(\d+)-(\d+),(\d+)-(\d+)$").unwrap();

    let range_pairs = input
        .lines()
        .map(|line| {
            let captures = regex.captures(line).unwrap();
            (
                captures.get(1).unwrap().as_str().parse::<usize>().unwrap()
                    ..=captures.get(2).unwrap().as_str().parse::<usize>().unwrap(),
                captures.get(3).unwrap().as_str().parse::<usize>().unwrap()
                    ..=captures.get(4).unwrap().as_str().parse::<usize>().unwrap(),
            )
        })
        .collect::<Vec<RangePair>>();

    range_pairs
}

fn part_1(input: &str) -> String {
    let overlaps = parse_input(input)
        .iter()
        .filter(|ranges| {
            return ranges.0.start() >= ranges.1.start() && ranges.0.end() <= ranges.1.end()
                || ranges.1.start() >= ranges.0.start() && ranges.1.end() <= ranges.0.end();
        })
        .count();

    format!("{overlaps}")
}

fn part_2(input: &str) -> String {
    let overlaps = parse_input(input)
        .iter()
        .filter(|ranges| {
            return ranges.0.start() >= ranges.1.start() && ranges.0.start() <= ranges.1.end()
                || ranges.1.start() >= ranges.0.start() && ranges.1.start() <= ranges.0.end();
        })
        .count();

    format!("{overlaps}")
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "2")
    }
    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "4")
    }
}
