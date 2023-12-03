use std::fmt::Display;

use crate::include_input;

const CYCLE_DAYS: usize = 7;
const NEW_DAYS: usize = CYCLE_DAYS + 2;

struct School {
    day: usize,
    ages: [usize; NEW_DAYS],
}

impl School {
    /// Create new School struct by parsting the input string
    fn parse(input: &str) -> Self {
        let fishes = input.split(',');

        let mut ages = [0; NEW_DAYS];

        for age_str in fishes {
            let age = age_str.parse::<usize>().unwrap();

            ages[age] += 1;
        }

        School { day: 0, ages }
    }

    /// Simulate one day
    pub fn iterate(&mut self) {
        self.day += 1;

        let mut new_ages = [0; NEW_DAYS];

        // copy and shift fished
        new_ages[..(NEW_DAYS - 1)].clone_from_slice(&self.ages[1..NEW_DAYS]);

        // handle reproducing fishes
        new_ages[CYCLE_DAYS - 1] += self.ages[0];
        new_ages[NEW_DAYS - 1] += self.ages[0];

        self.ages = new_ages;
    }

    pub fn count(&self) -> usize {
        let mut count = 0;

        for i in 0..NEW_DAYS {
            count += self.ages[i]
        }

        count
    }
}

impl Display for School {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "After {} days: {}", self.day, self.count())
    }
}

/// Run Simulation for day 6 'lanternfish' of Advent of Code
/// <https://adventofcode.com/2021/day/6>
pub fn lanternfish() {
    println!("Simulating lanternfish...");

    let input = include_input!("lanternfish");
    let mut school = School::parse(input);
    println!("{}", school);

    // PART 1
    for _ in 0..80 {
        school.iterate();
    }
    println!("{}", school);

    // PART 2
    for _ in 0..(256 - 80) {
        school.iterate();
    }
    println!("{}", school);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_count() {
        let input = "0,1,1,2,2,2,3,3,3,3";
        let s = School::parse(input);
        assert_eq!(s.count(), 10);
    }

    #[test]
    fn test_iterate_days() {
        let mut s = School::parse("1");
        assert_eq!(s.day, 0);

        s.iterate();

        assert_eq!(s.day, 1);
    }

    #[test]
    fn test_iterate_age() {
        let mut s = School::parse("1");
        assert_eq!(s.ages[0], 0);
        assert_eq!(s.ages[1], 1);

        s.iterate();
        assert_eq!(s.ages[0], 1);
        assert_eq!(s.ages[1], 0);

        s.iterate();
        assert_eq!(s.ages[0], 0);
        assert_eq!(s.ages[CYCLE_DAYS - 1], 1);
        assert_eq!(s.ages[NEW_DAYS - 1], 1);

        assert_eq!(s.count(), 2);
    }

    #[test]
    fn test_parse_input() {
        let input = "0,2,3,4,5";
        let s = School::parse(input);

        assert_eq!(s.count(), 5);
        assert_eq!(s.ages, [1, 0, 1, 1, 1, 1, 0, 0, 0]);
    }

    #[test]
    fn test_example() {
        let input = "3,4,3,1,2";

        let mut s = School::parse(input);

        for _ in 0..18 {
            s.iterate();
        }

        assert_eq!(s.count(), 26);

        for _ in 0..(80 - 18) {
            s.iterate();
        }

        assert_eq!(s.count(), 5934);
    }
}
