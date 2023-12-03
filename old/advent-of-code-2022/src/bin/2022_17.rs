use aoc::{client::get_input, point::Point};
use std::{collections::HashSet, error::Error};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 17)?.replace('\n', "");
    println!("solution part 1: {}", part_1(&input)?);
    println!("solution part 2: {}", part_2(&input)?);

    Ok(())
}

/// ####
//
// .#.
// ###
// .#.
//
// ..#
// ..#
// ###
//
// #
// #
// #
// #
//
// ##
// ##
fn get_blocks() -> Vec<Vec<Point>> {
    vec![
        vec![
            Point::new(0, 0, 0),
            Point::new(1, 0, 0),
            Point::new(2, 0, 0),
            Point::new(3, 0, 0),
        ],
        vec![
            Point::new(1, 0, 0),
            Point::new(0, 1, 0),
            // Point::new(1, 1, 0), this block can never interact with anything
            Point::new(2, 1, 0),
            Point::new(1, 2, 0),
        ],
        vec![
            Point::new(0, 0, 0),
            Point::new(1, 0, 0),
            Point::new(2, 0, 0),
            Point::new(2, 1, 0),
            Point::new(2, 2, 0),
        ],
        vec![
            Point::new(0, 0, 0),
            Point::new(0, 1, 0),
            Point::new(0, 2, 0),
            Point::new(0, 3, 0),
        ],
        vec![
            Point::new(0, 0, 0),
            Point::new(0, 1, 0),
            Point::new(1, 0, 0),
            Point::new(1, 1, 0),
        ],
    ]
}

fn check_block(position: &Point, block: &[Point], fixed_blocks: &HashSet<Point>) -> bool {
    !block
        .iter()
        .any(|b| !check_point(&(*b + *position), fixed_blocks))
}

fn find_cycle(elements: &[usize]) -> (usize, usize) {
    for offset in 0..elements.len() / 2 {
        let offsetted_elements = &elements[offset..];
        for n in (32..=offsetted_elements.len()).step_by(2) {
            if offsetted_elements[0..n / 2] == offsetted_elements[n / 2..n] {
                return (offset, n / 2);
            }
        }
    }
    (0, elements.len())
}

fn check_point(position: &Point, fixed_blocks: &HashSet<Point>) -> bool {
    // check boundaries
    if position.x < 0 {
        return false;
    }
    if position.x >= 7 {
        return false;
    }
    if position.y <= 0 {
        return false;
    }

    !fixed_blocks.contains(position)
}

fn build_tower(input: &str, blocks: usize) -> (usize, Vec<usize>) {
    let mut height = 0usize;
    let mut diffs: Vec<usize> = Vec::new();
    let mut fixed_blocks: HashSet<Point> = HashSet::new();

    let mut movements = input
        .chars()
        .map(|c| match c {
            '<' => -1,
            '>' => 1,
            _ => unreachable!(),
        })
        .cycle();

    get_blocks().iter().cycle().take(blocks).for_each(|block| {
        let mut position = Point::new(2, height as isize + 1 + 3, 0);

        loop {
            let movement = movements.next().unwrap();

            if check_block(
                &(position + Point::new(movement, 0, 0)),
                block,
                &fixed_blocks,
            ) {
                position.x += movement;
            }

            if check_block(&(position + Point::new(0, -1, 0)), block, &fixed_blocks) {
                position.y -= 1;
            } else {
                let last_height = height;

                for point in block {
                    let actual_pos = *point + position;
                    fixed_blocks.insert(actual_pos);
                    height = usize::max(actual_pos.y as usize, height);
                }

                diffs.push(height - last_height);

                return;
            }
        }
    });

    (height, diffs)
}

fn part_1(input: &str) -> Result<String, Box<dyn Error>> {
    Ok(format!("{}", &build_tower(input, 2022).0))
}

fn part_2(input: &str) -> Result<String, Box<dyn Error>> {
    let num_blocks = 1000000000000;
    let (_height, diffs) = build_tower(input, 10000);

    let (offset, cycle) = find_cycle(&diffs);

    let num_cycles = (num_blocks - offset) / cycle;
    let num_end = (num_blocks - offset) % cycle;

    let start = diffs[0..offset].iter().sum::<usize>();
    let center = diffs[offset..offset + cycle].iter().sum::<usize>() * num_cycles;
    let end = diffs[offset..offset + num_end].iter().sum::<usize>();

    println!("{offset}, {cycle}");

    Ok(format!("{}", start + center + end))
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT).unwrap(), "3068")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT).unwrap(), "1514285714288")
    }
}
