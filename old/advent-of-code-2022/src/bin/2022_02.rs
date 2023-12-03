use aoc::client::get_input;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 2)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

#[derive(PartialEq, PartialOrd, Clone, Copy)]
enum Hand {
    Rock = 1,
    Paper = 2,
    Scissor = 3,
}

fn parse_hand(input: &str) -> Hand {
    match input {
        "A" => Hand::Rock,
        "B" => Hand::Paper,
        "C" => Hand::Scissor,
        "X" => Hand::Rock,
        "Y" => Hand::Paper,
        "Z" => Hand::Scissor,
        _ => panic!("unexpected hand"),
    }
}

fn parse_outcome(input: &str) -> Outcome {
    match input {
        "X" => Outcome::Loss,
        "Y" => Outcome::Draw,
        "Z" => Outcome::Victory,
        _ => panic!("unexpected hand"),
    }
}

fn parse_input(input: &str) -> Vec<(Hand, Hand)> {
    input
        .lines()
        .map(|l| {
            let mut hands = l.split(' ').map(parse_hand);

            (hands.next().unwrap(), hands.next().unwrap())
        })
        .collect()
}

#[derive(Clone, Copy)]
enum Outcome {
    Victory = 6,
    Draw = 3,
    Loss = 0,
}

fn compare_hands(opponent: Hand, own: Hand) -> Outcome {
    match (own, opponent) {
        (Hand::Rock, Hand::Rock) => Outcome::Draw,
        (Hand::Rock, Hand::Paper) => Outcome::Loss,
        (Hand::Rock, Hand::Scissor) => Outcome::Victory,
        (Hand::Paper, Hand::Rock) => Outcome::Victory,
        (Hand::Paper, Hand::Paper) => Outcome::Draw,
        (Hand::Paper, Hand::Scissor) => Outcome::Loss,
        (Hand::Scissor, Hand::Rock) => Outcome::Loss,
        (Hand::Scissor, Hand::Paper) => Outcome::Victory,
        (Hand::Scissor, Hand::Scissor) => Outcome::Draw,
    }
}

fn part_1(input: &str) -> String {
    let score = parse_input(input)
        .iter()
        .map(|hands| {
            let (opponent, own) = hands;
            (compare_hands(*opponent, *own) as usize) + (*own as usize)
        })
        .sum::<usize>();
    format!("{score}")
}

fn parse_input_part_2(input: &str) -> Vec<(Hand, Outcome)> {
    input
        .lines()
        .map(|l| {
            let mut split = l.split(' ');

            (
                parse_hand(split.next().unwrap()),
                parse_outcome(split.next().unwrap()),
            )
        })
        .collect()
}

fn part_2(input: &str) -> String {
    let score: usize = parse_input_part_2(input).iter().map(|game| match game {
        (hand, Outcome::Draw) => *hand as usize,
        (Hand::Rock, Outcome::Loss) => Hand::Scissor as usize,
        (Hand::Rock, Outcome::Victory) => Hand::Paper as usize,
        (Hand::Paper, Outcome::Loss) => Hand::Rock as usize,
        (Hand::Paper, Outcome::Victory) => Hand::Scissor as usize,
        (Hand::Scissor, Outcome::Loss) => Hand::Paper as usize,
        (Hand::Scissor, Outcome::Victory) => Hand::Rock as usize,
    } + game.1 as usize)
    .sum();

    format!("{score}")
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "A Y
B X
C Z";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "15")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "12")
    }
}
