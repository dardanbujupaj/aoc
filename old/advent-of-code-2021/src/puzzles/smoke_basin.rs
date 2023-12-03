use std::collections::{HashSet, VecDeque};

use crate::{
    include_input,
    util::{Grid, Point},
};

pub fn smoke_basin() {
    println!("Scanning lava tubes...");

    let input = include_input!("smoke_basin");
    println!("Sum of low points (Part 1): {}", part1(input));
    println!("Sum of basin sizes (Part 2): {}", part2(input));
}

fn part1(input: &str) -> usize {
    let grid = parse_input(input);
    let mut lowpoints: Vec<usize> = Vec::new();

    for x in 0..grid.width() {
        for y in 0..grid.height() {
            let position = Point::at(x, y);
            let value = grid.get(position);

            if !grid.get_4_neighbours(position).iter().any(|n| *n <= value) {
                lowpoints.push(value as usize + 1);
            }
        }
    }

    lowpoints.iter().sum()
}

fn part2(input: &str) -> usize {
    let grid = parse_input(input);
    let mut lowpoints: Vec<Point> = Vec::new();

    for x in 0..grid.width() {
        for y in 0..grid.height() {
            let position = Point::at(x, y);

            let value = grid.get(position);

            if !grid.get_4_neighbours(position).iter().any(|n| *n <= value) {
                lowpoints.push(position);
            }
        }
    }

    let mut basins: Vec<usize> = lowpoints.iter().map(|p| basin(&grid, *p)).collect();

    basins.sort_unstable();

    basins.iter().rev().take(3).product()
}

/// determine the size of a basin
fn basin(grid: &Grid<u8>, lowpoint: Point) -> usize {
    let mut deque = VecDeque::new();
    let mut visited = HashSet::new();
    deque.push_back(lowpoint);

    while deque.front().is_some() {
        let next = deque.pop_front().unwrap();
        if visited.contains(&next) {
            continue;
        }
        visited.insert(next);

        for n in get_4_neighbour_points(next) {
            if grid.is_in_grid(n) && grid.get(n) != 9 {
                deque.push_back(n)
            }
        }
    }

    visited.len()
}

fn get_4_neighbour_points(point: Point) -> Vec<Point> {
    vec![
        Point::at(point.x - 1, point.y),
        Point::at(point.x + 1, point.y),
        Point::at(point.x, point.y - 1),
        Point::at(point.x, point.y + 1),
    ]
}

fn parse_input(input: &str) -> Grid<u8> {
    let height = input.lines().clone().count();
    let width = input.lines().next().unwrap().chars().count();

    let data: Vec<u8> = input
        .lines()
        .flat_map(|l| l.split(""))
        .filter(|c| !c.is_empty())
        .map(|c| c.parse().unwrap())
        .collect();

    Grid::with_data(width as isize, height as isize, data)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        let input = "2199943210
3987894921
9856789892
8767896789
9899965678";
        assert_eq!(part1(input), 15);
    }

    #[test]
    fn test_part_2() {
        let input = "2199943210
3987894921
9856789892
8767896789
9899965678";
        assert_eq!(part2(input), 1134);
    }
}
