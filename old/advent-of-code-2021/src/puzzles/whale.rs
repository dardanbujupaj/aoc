use std::cmp::min;

use crate::include_input;

/// Run Simulation for day 7 'whale' of Advent of Code
/// <https://adventofcode.com/2021/day/7>
pub fn whale() {
    println!("Optimizing whale ...");
    let input = include_input!("whale");

    let positions = parse_input(input);

    println!("Positions: {:?}", positions);

    println!("Part 1: {} fuel", part1(&positions));
    println!("Part 2: {} fuel", part2(&positions));
}

/// Parse the input to a Vec<isize>
fn parse_input(input: &str) -> Vec<isize> {
    input
        .split(',')
        .map(|x| x.parse::<isize>().unwrap())
        .collect()
}

/// Calculates the sum of an isize Vector
fn sum(positions: &[isize]) -> isize {
    let mut sum = 0;

    for position in positions {
        sum += position;
    }

    sum
}

/// Calculates the average of an isize Vector
fn average(positions: &[isize]) -> f64 {
    sum(positions) as f64 / positions.len() as f64
}

/// Calculates the median of an isize Vector
fn median(pos: &[isize]) -> f64 {
    let mut positions = pos.to_owned();

    positions.sort_unstable();

    match positions.len() % 2 {
        0 => (positions[positions.len() / 2] + positions[positions.len() / 2 - 1]) as f64 / 2.0,
        1 => positions[positions.len() / 2] as f64,
        _ => 0.0,
    }
}

/// Calculate fuel for part 1
/// median makes sure that as few moves as possible are made
fn part1(positions: &[isize]) -> isize {
    let align = median(positions).round() as isize;

    let mut fuel = 0;

    for position in positions {
        let distance = align - position;
        fuel += match distance {
            0.. => distance,
            _ => -distance,
        }
    }

    fuel
}

/// Calculate fuel for part 2 here it's ok if more moves are made,
/// as long as the outliers have to move as little as possible because the move costs rise non linear
fn part2(positions: &[isize]) -> isize {
    let align = average(positions);

    min(
        calculate_nonlinear_fuel(positions, align.floor() as isize),
        calculate_nonlinear_fuel(positions, align.ceil() as isize),
    )
}

fn calculate_nonlinear_fuel(positions: &[isize], align: isize) -> isize {
    let mut fuel = 0;

    for position in positions {
        let distance = isize::abs(align - position);

        fuel += distance * (distance + 1) / 2;
    }

    fuel
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_with_input() {
        whale();
    }

    #[test]
    fn test_example() {
        let input = "16,1,2,0,4,2,7,1,2,14";

        let positions = parse_input(input);

        let part1 = part1(&positions);
        assert_eq!(part1, 37);

        let part2 = part2(&positions);
        assert_eq!(part2, 168);
    }

    #[test]
    fn test_average() {
        assert_eq!(average(&[0, 1, 2]), 1.0)
    }

    #[test]
    fn test_median() {
        assert_eq!(median(&[0, 1, 2]), 1.0);
        assert_eq!(median(&[0, 2, 2]), 2.0);
        assert_eq!(median(&[1, 2]), 1.5);
        assert_eq!(median(&[0, 2]), 1.0);
    }
}
