use std::fmt::Display;

use super::Point;

#[derive(Debug, PartialEq, Eq)]
pub struct Grid<S> {
    data: Vec<S>,
    width: isize,
    height: isize,
}

impl<S> Grid<S>
where
    S: Copy,
{
    pub fn new(width: isize, height: isize, default: S) -> Self {
        Grid {
            data: vec![default; (width * height).try_into().unwrap()],
            width,
            height,
        }
    }

    pub fn with_data(width: isize, height: isize, data: Vec<S>) -> Self {
        Grid {
            data,
            width,
            height,
        }
    }

    pub fn data(&self) -> &Vec<S> {
        &self.data
    }

    pub fn width(&self) -> isize {
        self.width
    }

    pub fn height(&self) -> isize {
        self.height
    }

    pub fn get(&self, position: Point) -> S {
        self.data[(position.y * self.width + position.x) as usize]
    }

    pub fn set(&mut self, position: Point, value: S) {
        self.data[(position.y * self.width + position.x) as usize] = value;
    }

    pub fn is_in_grid(&self, position: Point) -> bool {
        position.x >= 0 && position.x < self.width && position.y >= 0 && position.y < self.height
    }

    pub fn get_4_neighbours(&self, position: Point) -> Vec<S> {
        let mut neigbours = Vec::new();
        if position.x > 0 {
            neigbours.push(self.get(position + Point::at(-1, 0)))
        }
        if position.x < self.width - 1 {
            neigbours.push(self.get(position + Point::at(1, 0)))
        }
        if position.y > 0 {
            neigbours.push(self.get(position + Point::at(0, -1)))
        }
        if position.y < self.height - 1 {
            neigbours.push(self.get(position + Point::at(0, 1)))
        }

        neigbours
    }

    /// Get 4 neighbours as Points
    pub fn get_4_neighbours_p(&self, position: Point) -> Vec<Point> {
        let mut neigbours = Vec::new();
        if position.x > 0 {
            neigbours.push(position + Point::at(-1, 0))
        }
        if position.x < self.width - 1 {
            neigbours.push(position + Point::at(1, 0))
        }
        if position.y > 0 {
            neigbours.push(position + Point::at(0, -1))
        }
        if position.y < self.height - 1 {
            neigbours.push(position + Point::at(0, 1))
        }

        neigbours
    }

    pub fn get_8_neighbours(&self, position: Point) -> Vec<Point> {
        let mut neigbours = Vec::new();
        for nx in (position.x - 1)..=(position.x + 1) {
            for ny in (position.y - 1)..=(position.y + 1) {
                let posn = Point::at(nx, ny);
                if self.is_in_grid(posn) && !(nx == position.x && ny == position.y) {
                    neigbours.push(posn)
                }
            }
        }

        neigbours
    }
}

impl<S> Display for Grid<S>
where
    S: Display,
    S: Copy,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for y in 0..self.height {
            for x in 0..self.width {
                if let Err(err) = write!(f, "{}", self.get(Point::at(x, y))) {
                    return Err(err);
                }
            }
            if let Err(err) = writeln!(f) {
                return Err(err);
            }
        }
        writeln!(f)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        assert_eq!(
            Grid::new(1, 5, 0u8),
            Grid {
                data: vec![0u8; 5],
                width: 1,
                height: 5
            }
        )
    }

    #[test]
    fn test_get() {
        let grid = Grid {
            data: vec![1, 2, 3, 4],
            width: 2,
            height: 2,
        };

        assert_eq!(grid.get(Point { x: 0, y: 0 }), 1);
        assert_eq!(grid.get(Point { x: 1, y: 0 }), 2);
        assert_eq!(grid.get(Point { x: 0, y: 1 }), 3);
        assert_eq!(grid.get(Point { x: 1, y: 1 }), 4);
    }

    #[test]
    fn test_set() {
        let mut grid = Grid {
            data: vec![0u8; 4],
            width: 2,
            height: 2,
        };

        grid.set(Point { x: 0, y: 0 }, 1);
        assert_eq!(
            grid,
            Grid {
                data: vec![1, 0, 0, 0],
                width: 2,
                height: 2
            }
        );
        grid.set(Point { x: 1, y: 0 }, 2);
        assert_eq!(
            grid,
            Grid {
                data: vec![1, 2, 0, 0],
                width: 2,
                height: 2
            }
        );
        grid.set(Point { x: 0, y: 1 }, 3);
        assert_eq!(
            grid,
            Grid {
                data: vec![1, 2, 3, 0],
                width: 2,
                height: 2
            }
        );
        grid.set(Point { x: 1, y: 1 }, 4);
        assert_eq!(
            grid,
            Grid {
                data: vec![1, 2, 3, 4],
                width: 2,
                height: 2
            }
        );
    }
}
