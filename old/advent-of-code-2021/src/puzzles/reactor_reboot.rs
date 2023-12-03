use std::{collections::HashSet, ops::RangeInclusive};

use regex::Regex;

use crate::{include_input, time};

const INPUT_EXPRESSION: &str =
    r"(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)";

pub fn reactor_reboot() {
    println!("Rebooting reactor...");
    println!(
        "{} cells on",
        time!("Part1", part1(include_input!("reactor_reboot")))
    );
}

fn part1(input: &str) -> usize {
    let mut active_cells: HashSet<Position> = HashSet::new();
    let instructions = parse_input(input);
    let actual_cuboid = Cuboid {
        x_range: -50..=50,
        y_range: -50..=50,
        z_range: -50..=50,
    };

    for (cuboid, on) in instructions {
        let union_cube = actual_cuboid.union(&cuboid);

        for x in union_cube.x_range.clone() {
            for y in union_cube.y_range.clone() {
                for z in union_cube.z_range.clone() {
                    if on {
                        active_cells.insert((x, y, z));
                    } else {
                        active_cells.remove(&(x, y, z));
                    }
                }
            }
        }
    }

    active_cells.len()
}

type Position = (isize, isize, isize);

#[derive(Debug, PartialEq, Eq)]
struct Cuboid {
    x_range: RangeInclusive<isize>,
    y_range: RangeInclusive<isize>,
    z_range: RangeInclusive<isize>,
}

impl Cuboid {
    fn union(&self, other: &Cuboid) -> Cuboid {
        Cuboid {
            x_range: isize::max(*self.x_range.start(), *other.x_range.start())
                ..=isize::min(*self.x_range.end(), *other.x_range.end()),
            y_range: isize::max(*self.y_range.start(), *other.y_range.start())
                ..=isize::min(*self.y_range.end(), *other.y_range.end()),
            z_range: isize::max(*self.z_range.start(), *other.z_range.start())
                ..=isize::min(*self.z_range.end(), *other.z_range.end()),
        }
    }
}

fn parse_input(input: &str) -> Vec<(Cuboid, bool)> {
    // on x=-20..26,y=-36..17,z=-47..7
    let expression = Regex::new(INPUT_EXPRESSION).unwrap();
    expression
        .captures_iter(input)
        .map(|capture| {
            let on = &capture[1] == "on";

            let from_x = capture[2].parse::<isize>().unwrap();
            let to_x = capture[3].parse::<isize>().unwrap();
            let from_y = capture[4].parse::<isize>().unwrap();
            let to_y = capture[5].parse::<isize>().unwrap();
            let from_z = capture[6].parse::<isize>().unwrap();
            let to_z = capture[7].parse::<isize>().unwrap();

            let cube = Cuboid {
                x_range: from_x..=to_x,
                y_range: from_y..=to_y,
                z_range: from_z..=to_z,
            };

            (cube, on)
        })
        .collect()
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_solution() {
        reactor_reboot();
    }

    #[test]
    fn test_parse_input() {
        let input = "on x=-20..26,y=-36..17,z=-47..7";
        let expected_cube = (
            Cuboid {
                x_range: -20..=26,
                y_range: -36..=17,
                z_range: -47..=7,
            },
            true,
        );

        assert_eq!(parse_input(input)[0], expected_cube);
    }
    #[test]
    fn test_cuboid_union() {
        let a = Cuboid {
            x_range: -5..=5,
            y_range: -5..=5,
            z_range: -5..=5,
        };
        let b = Cuboid {
            x_range: 0..=10,
            y_range: 0..=10,
            z_range: 0..=10,
        };
        let expected_union = Cuboid {
            x_range: 0..=5,
            y_range: 0..=5,
            z_range: 0..=5,
        };

        assert_eq!(a.union(&b), expected_union);
    }

    #[test]
    fn test_part1() {
        let input = include_input!("reactor_reboot_example");
        assert_eq!(part1(input), 590784);
    }
}
