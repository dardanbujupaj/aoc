use std::collections::HashMap;

use crate::util::{Grid, Point};
use crate::{include_input, time};

pub fn chiton() {
    println!("Calculating risk...");
    let input = include_input!("chiton");
    println!(
        "Total risk level {} (Part 1)",
        time!("Part 1", part1(input))
    );
    println!(
        "Total risk level {} (Part 2)",
        time!("Part 2", part2(input))
    );
}

fn part1(input: &str) -> usize {
    let grid = time!("Input", parse_input(input, 1));

    djikstra(
        &grid,
        Point::at(0, 0),
        Point::at(grid.width() - 1, grid.height() - 1),
    )
}

fn part2(input: &str) -> usize {
    let grid = parse_input(input, 5);

    djikstra(
        &grid,
        Point::at(0, 0),
        Point::at(grid.width() - 1, grid.height() - 1),
    )
}

fn djikstra(grid: &Grid<usize>, from: Point, to: Point) -> usize {
    let mut risk_map: HashMap<Point, usize> = HashMap::new();
    risk_map.insert(from, 0);

    let mut visited: Vec<Point> = Vec::new();

    loop {
        let min = risk_map.iter().min_by_key(|p| p.1).unwrap();
        let point = *min.0;
        let risk = *min.1;

        if point == to {
            break risk;
        }

        risk_map.remove(&point);
        visited.push(point);

        // iterate over neighbours
        for next in grid.get_4_neighbours_p(point) {
            let next_risk = risk + grid.get(next);

            // Update or initialize risk level
            if visited.contains(&next) {
                continue;
            } else if !risk_map.contains_key(&next) || risk_map.get(&next).unwrap() > &next_risk {
                risk_map.insert(next, next_risk);
            }
        }
    }
}

fn parse_input(input: &str, scale: usize) -> Grid<usize> {
    let height = input.lines().clone().count() * scale;
    let width = input.lines().next().unwrap().chars().count() * scale;

    let data: Vec<usize> = input
        .lines()
        //.map(|l| l.repeat(scale))
        .flat_map(|l| l.split("").filter(|c| !c.is_empty()).cycle().take(width))
        //.filter(|c| !c.is_empty())
        .map(|c| c.parse().unwrap())
        .collect();

    let mut grid = Grid::with_data(width as isize, height as isize, data.repeat(scale));

    for x in 0..width {
        for y in 0..height {
            let sx = x * scale / width;
            let sy = y * scale / height;
            let mut value = grid.get(Point::at(x as isize, y as isize)) + sx + sy;
            if value > 9 {
                value = value % 10 + 1;
            }

            grid.set(Point::at(x as isize, y as isize), value);
        }
    }

    grid
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        let input = "1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581";
        assert_eq!(part1(input), 40);
    }
    #[test]
    fn test_part_2() {
        let input = "1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581";
        assert_eq!(part2(input), 315);
    }
}
