use aoc::{client::get_input, point::Point};
use std::{collections::HashSet, error::Error, iter};

#[derive(Debug)]
struct Rope {
    knots: Vec<Point>,
}

impl Rope {
    fn new(length: usize) -> Self {
        if length < 2 {
            panic!("Rope needs at least two knots")
        }

        Self {
            knots: vec![Point::default(); length],
        }
    }

    fn move_by(&mut self, distance: Point) {
        let mut head = self.knots.get_mut(0).unwrap();

        // move head
        head.x += distance.x;
        head.y += distance.y;

        // update tail
        for i in 1..self.knots.len() {
            let leading_knot = *self.knots.get(i - 1).unwrap();
            let current_knot = self.knots.get_mut(i).unwrap();

            if isize::abs(current_knot.x - leading_knot.x) <= 1
                && isize::abs(current_knot.y - leading_knot.y) <= 1
            {
                // knot is close enough
                break;
            }

            current_knot.y += isize::signum(leading_knot.y - current_knot.y);
            current_knot.x += isize::signum(leading_knot.x - current_knot.x);
        }
    }

    fn tail(&self) -> &Point {
        self.knots.last().unwrap()
    }
}

impl Default for Rope {
    fn default() -> Self {
        Self::new(2)
    }
}

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 9)?;
    println!("solution part 1: {}", part_1(&input)?);
    println!("solution part 2: {}", part_2(&input)?);

    Ok(())
}

fn parse_input(input: &str) -> Vec<Point> {
    input
        .lines()
        .flat_map(|line| {
            let mut parts = line.split(' ');

            let direction = match parts.next().unwrap() {
                "L" => Point::new(-1, 0, 0),
                "R" => Point::new(1, 0, 0),
                "U" => Point::new(0, 1, 0),
                "D" => Point::new(0, -1, 0),
                _ => unreachable!(),
            };
            let steps = parts.next().unwrap().parse::<usize>().unwrap();

            iter::repeat(direction).take(steps)
        })
        .collect()
}

fn part_1(input: &str) -> Result<String, Box<dyn Error>> {
    let moves = parse_input(input);
    let mut rope = Rope::default();
    let mut visited = HashSet::<Point>::new();

    visited.insert(*rope.tail());

    for next_move in moves {
        rope.move_by(next_move);
        visited.insert(*rope.tail());
    }

    Ok(format!("{}", visited.len()))
}

fn part_2(input: &str) -> Result<String, Box<dyn Error>> {
    let moves = parse_input(input);
    let mut rope = Rope::new(10);
    let mut visited = HashSet::<Point>::new();

    visited.insert(*rope.tail());

    for next_move in moves {
        rope.move_by(next_move);
        visited.insert(*rope.tail());
    }

    Ok(format!("{}", visited.len()))
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT).unwrap(), "13")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT).unwrap(), "1")
    }

    #[test]
    fn test_part_2_extended() {
        const EXTENDED_TEST_INPUT: &str = "R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20";
        assert_eq!(part_2(EXTENDED_TEST_INPUT).unwrap(), "36")
    }
}
