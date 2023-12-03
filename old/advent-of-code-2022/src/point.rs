use std::{
    num::ParseIntError,
    ops::{Add, AddAssign},
    str::FromStr,
};

#[derive(Debug, PartialEq, Eq, Clone, Copy, Hash, Default)]
pub struct Point {
    pub x: isize,
    pub y: isize,
    pub z: isize,
}

impl Point {
    pub fn new(x: isize, y: isize, z: isize) -> Point {
        Self { x, y, z }
    }
}

impl FromStr for Point {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut values = s.split(',').map(|p| p.parse::<isize>().unwrap());

        Ok(Self {
            x: values.next().unwrap(),
            y: values.next().unwrap(),
            z: values.next().unwrap_or(0),
        })
    }
}

impl Add for Point {
    type Output = Point;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }
}

impl AddAssign for Point {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
        self.z += rhs.z;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        assert_eq!(Point::default(), Point { x: 0, y: 0, z: 0 });
    }

    #[test]
    fn test_at() {
        assert_eq!(Point::new(1, 2, 0), Point { x: 1, y: 2, z: 0 });
    }

    #[test]
    fn test_parse_2d() {
        assert_eq!(Point::from_str("1,2").unwrap(), Point { x: 1, y: 2, z: 0 });
    }

    #[test]
    fn test_parse_3d() {
        assert_eq!(
            Point::from_str("1,2,3").unwrap(),
            Point { x: 1, y: 2, z: 3 }
        );
    }

    #[test]
    fn test_add() {
        assert_eq!(
            Point { x: 1, y: 2, z: 1 } + Point { x: 2, y: 1, z: 3 },
            Point { x: 3, y: 3, z: 4 }
        );
        assert_ne!(
            Point { x: 1, y: 2, z: 0 } + Point { x: 2, y: 1, z: 1 },
            Point { x: 1, y: 2, z: 0 }
        );
    }
}
