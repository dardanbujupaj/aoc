use crate::{include_input, time};

pub fn dirac_dice() {
    println!("Rolling dice...");
    println!(
        "Score: {} (Part 1)",
        time!("Part 1", part1(include_input!("dirac_dice")))
    );
    // println!("Score: {} (Part 1)", time!(part1(include_input!("dirac_dice"))));
}

fn part1(input: &str) -> usize {
    let mut next_player = 1;
    let mut die = DeterministicDie::new();
    let mut score1 = 0;
    let mut score2 = 0;
    let (mut position1, mut position2) = parse_input(input);

    let loser_score = loop {
        let value = die.roll() + die.roll() + die.roll();

        if next_player == 1 {
            position1 = (position1 + value - 1) % 10 + 1;
            score1 += position1;
        } else {
            position2 = (position2 + value - 1) % 10 + 1;
            score2 += position2;
        }

        if score1 >= 1000 {
            break score2;
        }
        if score2 >= 1000 {
            break score1;
        }

        next_player = (next_player) % 2 + 1
    };

    loser_score * die.rolls
}

#[allow(dead_code)]
fn part2(_input: &str) -> usize {
    /*
    let mut next_player = 1;
    let mut die = DeterministicDie::new();

    let scores = vec![0; 21*21];
    let (mut position1, mut position2) = parse_input(input);

    let loser_score = loop {
      if next_player == 1 {
        position1 = (position1 + value - 1) % 10 + 1;
        score1 += position1;
      } else {
        position2 = (position2 + value - 1) % 10 + 1;
        score2 += position2;
      }

      if score1 >= 1000 {
        break score2
      }
      if score2 >= 1000 {
        break score1
      }

      next_player = (next_player) % 2 + 1
    };

    loser_score * die.rolls
    */
    0
}

trait Die {
    fn roll(&mut self) -> usize;
}
struct DeterministicDie {
    rolls: usize,
}
impl DeterministicDie {
    fn new() -> Self {
        Self { rolls: 0 }
    }
}

impl Die for DeterministicDie {
    fn roll(&mut self) -> usize {
        self.rolls += 1;
        (self.rolls - 1) % 100 + 1
    }
}

fn parse_input(input: &str) -> (usize, usize) {
    let mut positions = input
        .lines()
        .map(|l| l.get(l.len() - 1..).unwrap())
        .map(|n| n.parse().unwrap());
    (positions.next().unwrap(), positions.next().unwrap())
}

#[cfg(test)]
mod tests {
    use crate::include_input;

    use super::*;

    #[test]
    fn test_parse_input() {
        let positions = parse_input(include_input!("dirac_dice_example"));

        assert_eq!(positions, (4, 8));
    }

    #[test]
    fn test_part_1() {
        assert_eq!(part1(include_input!("dirac_dice_example")), 739785);
    }
}
