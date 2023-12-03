use crate::{
    include_input, time,
    util::{Grid, Point},
};

pub fn trench_map() {
    println!(
        "{} lit pixels (Part 1)",
        time!("Part 1", part1(include_input!("trench_map")))
    );
    println!(
        "{} lit pixels (Part 2)",
        time!("Part 2", part2(include_input!("trench_map")))
    );
}

fn part1(input: &str) -> usize {
    let mut default = false;
    let (mut map, algorithm) = parse_input(input);

    for _i in 0..2 {
        let next = enhance_image(map, &algorithm, default);
        map = next.0;
        default = next.1;
    }

    count_lights(&map)
}

fn part2(input: &str) -> usize {
    let mut default = false;
    let (mut map, algorithm) = parse_input(input);

    for _i in 0..50 {
        let next = enhance_image(map, &algorithm, default);
        map = next.0;
        default = next.1;
    }

    count_lights(&map)
}

fn count_lights(grid: &Grid<bool>) -> usize {
    grid.data().iter().filter(|x| **x).count()
}

fn enhance_image(map: Grid<bool>, algorithm: &[bool], default: bool) -> (Grid<bool>, bool) {
    let mut next_map = Grid::new(map.width() + 2, map.height() + 2, false);
    for px in 0..next_map.width() {
        for py in 0..next_map.height() {
            let mut shift = 9;
            let mut index = 0;
            for y in py - 1..=py + 1 {
                for x in px - 1..=px + 1 {
                    shift -= 1;

                    let value = match map.is_in_grid(Point::at(x - 1, y - 1)) {
                        true => map.get(Point::at(x - 1, y - 1)),
                        false => default,
                    };

                    if value {
                        index |= 1 << shift;
                    }
                }
            }

            if algorithm[index] {
                next_map.set(Point::at(px, py), true);
            }
        }
    }

    let next_default = match default {
        true => *algorithm.last().unwrap(),
        false => *algorithm.first().unwrap(),
    };

    (next_map, next_default)
}

fn parse_input(input: &str) -> (Grid<bool>, Vec<bool>) {
    let algorithm = input
        .lines()
        .next()
        .unwrap()
        .chars()
        .filter(|c| !c.is_whitespace())
        .map(|c| c == '#')
        .collect();

    let width = input.lines().nth(2).unwrap().chars().count() as isize;
    let height = input.lines().skip(2).count() as isize;

    let data = input
        .lines()
        .skip(2)
        .flat_map(|l| l.chars().filter(|c| !c.is_whitespace()).map(|c| c == '#'))
        .collect();

    let grid = Grid::with_data(width, height, data);

    (grid, algorithm)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solution() {
        trench_map();
    }

    #[test]
    fn test_part_1() {
        assert_eq!(part1(include_input!("trench_map_example")), 35);
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part2(include_input!("trench_map_example")), 3351);
    }

    #[test]
    fn test_parse_input() {
        let (map, algorithm) = parse_input(include_input!("trench_map_example"));

        assert_eq!(algorithm.len(), 512);
        assert_eq!(count_lights(&map), 10);
    }

    #[test]
    fn test_enhance_image() {
        let default0 = false;
        let (map0, algorithm) = parse_input(include_input!("trench_map_example"));
        assert_eq!(count_lights(&map0), 10);

        let (map1, default1) = enhance_image(map0, &algorithm, default0);
        assert_eq!(count_lights(&map1), 24);

        let (map2, _default2) = enhance_image(map1, &algorithm, default1);
        assert_eq!(count_lights(&map2), 35);
    }
}
