use aoc::{client::get_input, point::Point};
use std::{
    collections::{HashSet, VecDeque},
    error::Error,
    str::FromStr,
};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 18)?;
    println!("solution part 1: {}", part_1(&input)?);
    println!("solution part 2: {}", part_2(&input)?);

    Ok(())
}

const NEIGHBOURS: &[Point] = &[
    Point { x: -1, y: 0, z: 0 },
    Point { x: 1, y: 0, z: 0 },
    Point { x: 0, y: 1, z: 0 },
    Point { x: 0, y: -1, z: 0 },
    Point { x: 0, y: 0, z: 1 },
    Point { x: 0, y: 0, z: -1 },
];

fn part_1(input: &str) -> Result<String, Box<dyn Error>> {
    let mut points: HashSet<Point> = HashSet::new();
    let mut connections = 0;
    input
        .lines()
        .map(|line| Point::from_str(line).unwrap())
        .for_each(|point| {
            for neighbour in NEIGHBOURS {
                if points.contains(&(point + *neighbour)) {
                    connections += 1;
                }
            }
            points.insert(point);
        });

    Ok(format!("{}", points.len() * 6 - connections * 2))
}

fn part_2(input: &str) -> Result<String, Box<dyn Error>> {
    let points: HashSet<Point> =
        HashSet::from_iter(input.lines().map(|line| Point::from_str(line).unwrap()));
    let extent = points
        .iter()
        .flat_map(|p| vec![p.x, p.y, p.z])
        .max()
        .unwrap()
        + 1;

    let mut queue = VecDeque::from([Point::new(0, 0, 0)]);
    let mut visited: HashSet<Point> = HashSet::new();
    let mut surface_count = 0;

    while let Some(current) = queue.pop_front() {
        visited.insert(current);

        for neighbour in NEIGHBOURS {
            let point = current + *neighbour;

            if points.contains(&point) {
                surface_count += 1;
            } else if !queue.contains(&point)
                && !visited.contains(&point)
                && point.x <= extent
                && point.y <= extent
                && point.z <= extent
                && point.x >= -2
                && point.y >= -2
                && point.z > -2
            {
                queue.push_back(point);
            }
        }
    }

    Ok(format!("{surface_count}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT).unwrap(), "64")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT).unwrap(), "58")
    }
}
