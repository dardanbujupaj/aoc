use aoc::client::get_input;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 1)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

fn calculate_sums(input: &str) -> Vec<u32> {
    input
        .split("\n\n")
        .map(|bag| bag.lines().map(|food| food.parse::<u32>().unwrap()).sum())
        .collect()
}

fn part_1(input: &str) -> String {
    let sums = calculate_sums(input);

    sums.iter().max().unwrap().to_string()
}

fn part_2(input: &str) -> String {
    let mut calories = calculate_sums(input);

    calories.sort();
    calories.reverse();

    let sum: u32 = calories.iter().take(3).sum();
    sum.to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "1000
2000
3000

4000

5000
6000

7000
8000
9000

10000";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "24000")
    }
    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "45000")
    }
}
