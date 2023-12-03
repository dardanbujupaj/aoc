use crate::{
    include_input,
    util::{Grid, Line, Point},
};

pub fn hydrothermal_venture() {
    println!("Mapping vents...");

    let input = include_input!("hydrothermal_venture");

    println!("{} dangerous areas (Part 1)", part1(input));
    println!("{} diagonal dangerous areas (Part 2)", part2(input));
}

fn part1(input: &str) -> usize {
    let points: Vec<Point> = input
        .lines()
        .map(Line::parse)
        .filter(|l| (l.start.x == l.end.x) || (l.start.y == l.end.y))
        .flat_map(|l| l.get_points())
        .collect();

    let mut grid = Grid::new(1000, 1000, 0);

    for point in points {
        grid.set(point, grid.get(point) + 1);
    }

    grid.data().iter().filter(|v| **v >= 2).count()
}

fn part2(input: &str) -> usize {
    let points: Vec<Point> = input
        .lines()
        .map(Line::parse)
        .flat_map(|l| l.get_points())
        .collect();

    let mut grid = Grid::new(1000, 1000, 0);

    for point in points {
        grid.set(point, grid.get(point) + 1);
    }

    grid.data().iter().filter(|v| **v >= 2).count()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        let input = "0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2";

        assert_eq!(part1(input), 5);
    }

    #[test]
    fn test_part_2() {
        let input = "0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2";

        assert_eq!(part2(input), 12);
    }
}
