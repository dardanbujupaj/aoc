use std::ops::{Add, AddAssign};

use crate::include_input;

pub fn dive() {
    println!("Parsing commands...");
    let input = include_input!("dive");
    // println!("Input: {}", input);

    let positions = parse_input(input);
    // println!("Positions: {:?}", positions);

    let mut position = Position::new();

    let mut position2 = Position::new();
    let mut aim = 0;

    for p in positions {
        match p {
            Position { x: 0, y } => aim += y,
            Position { x, y: 0 } => position2 += Position { x, y: x * aim },
            _ => panic!("Somethings wrong with this command {:?}", p),
        }

        position += p;
    }

    println!("Distance (Part 1): {:?}", position.distance());
    println!("Distance (Part 2): {:?}", position2.distance());
}

fn parse_input(input: &str) -> Vec<Position> {
    input.lines().map(Position::parse).collect()
}

#[derive(Debug, PartialEq, Eq)]
struct Position {
    /// Horizontal position
    x: isize,
    /// Depth
    y: isize,
}

impl Position {
    fn new() -> Position {
        Position { x: 0, y: 0 }
    }

    fn parse(command: &str) -> Position {
        let parts: Vec<&str> = command.split_whitespace().collect();
        let direction = parts[0];
        let units = parts[1].parse().unwrap();

        match direction {
            "forward" => Position { x: units, y: 0 },
            "up" => Position { x: 0, y: -units },
            "down" => Position { x: 0, y: units },
            _ => panic!("Unknown command"),
        }
    }

    fn distance(&self) -> isize {
        self.x * self.y
    }
}

impl Add for Position {
    type Output = Position;

    fn add(self, rhs: Self) -> Self::Output {
        Position {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl AddAssign for Position {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_position_add() {
        let pos1 = Position { x: 1, y: 1 };
        let pos2 = Position { x: 2, y: 3 };

        let added = pos1 + pos2;
        assert_eq!(added, Position { x: 3, y: 4 });

        let mut pos3 = Position { x: 1, y: 1 };
        pos3 += Position { x: 5, y: 4 };
        assert_eq!(pos3, Position { x: 6, y: 5 });
    }

    #[test]
    fn test_position_distance() {
        assert_eq!(150, Position { x: 10, y: 15 }.distance());
    }

    #[test]
    fn test_position_parse() {
        let up_5 = "up 5";
        assert_eq!(Position::parse(up_5), Position { x: 0, y: -5 });

        let down_10 = "down 10";
        assert_eq!(Position::parse(down_10), Position { x: 0, y: 10 });

        let forward_09 = "forward 09";
        assert_eq!(Position::parse(forward_09), Position { x: 9, y: 0 });
    }

    #[test]
    fn test_parse_input() {
        let input = "up 10
      down 10
      forward 3";

        let positions = vec![
            Position { x: 0, y: -10 },
            Position { x: 0, y: 10 },
            Position { x: 3, y: 0 },
        ];

        assert_eq!(parse_input(input), positions)
    }
}
