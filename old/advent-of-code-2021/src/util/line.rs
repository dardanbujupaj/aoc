use crate::util::Point;

#[derive(Debug)]
pub struct Line {
    pub start: Point,
    pub end: Point,
}

impl Line {
    pub fn new(from: Point, to: Point) -> Self {
        Line {
            start: from,
            end: to,
        }
    }

    pub fn parse(input: &str) -> Self {
        let points: Vec<Point> = input.split(" -> ").map(Point::parse).collect();

        Line {
            start: points[0],
            end: points[1],
        }
    }

    pub fn get_points(&self) -> Vec<Point> {
        let mut points: Vec<Point> = Vec::new();

        let mut x = self.start.x;
        let mut y = self.start.y;

        let x_step = (self.end.x - self.start.x).signum();
        let y_step = (self.end.y - self.start.y).signum();

        while x != self.end.x + x_step || y != self.end.y + y_step {
            points.push(Point::at(x, y));

            x += x_step;
            y += y_step;
        }

        points
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse() {
        let input = "0,0 -> 2,3";

        let line = Line::parse(input);

        assert_eq!(line.start.x, 0);
        assert_eq!(line.start.y, 0);
        assert_eq!(line.end.x, 2);
        assert_eq!(line.end.y, 3);
    }

    #[test]
    fn test_get_points() {
        let line = Line {
            start: Point { x: 0, y: 0 },
            end: Point { x: 0, y: 2 },
        };

        let expected_points = vec![
            Point { x: 0, y: 0 },
            Point { x: 0, y: 1 },
            Point { x: 0, y: 2 },
        ];

        assert_eq!(line.get_points(), expected_points);
    }
}
