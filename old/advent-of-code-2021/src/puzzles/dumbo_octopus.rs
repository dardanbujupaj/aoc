use crate::{
    include_input,
    util::{Grid, Point},
};

pub fn dumbo_octopus() {
    println!("Evading octopuses...");

    let input = include_input!("dumbo_octopus");
    println!("{} flashes (Part 1)", part1(input));
    println!("Synchronized after {} flashes (Part 2)", part2(input));
}

fn part1(input: &str) -> usize {
    let mut count = 0;
    let mut grid = parse_input(input);
    for _ in 0..100 {
        count += iterate(&mut grid);
    }
    count
}

fn part2(input: &str) -> usize {
    let mut step = 0;
    let mut grid = parse_input(input);

    loop {
        let flashes = iterate(&mut grid);
        step += 1;
        if flashes >= (grid.width() * grid.width()) as usize {
            break;
        }
    }

    step
}

fn parse_input(input: &str) -> Grid<usize> {
    let height = input.lines().clone().count();
    let width = input.lines().next().unwrap().chars().count();

    println!("{}", input);

    let data: Vec<usize> = input
        .lines()
        .flat_map(|l| l.split(""))
        .filter(|c| !c.is_empty())
        .map(|c| c.parse().unwrap())
        .collect();

    Grid::with_data(width as isize, height as isize, data)
}

fn iterate(grid: &mut Grid<usize>) -> usize {
    let mut flash_count = 0;
    let mut pending_flashes: Vec<Point> = Vec::new();
    let mut flashed: Vec<Point> = Vec::new();

    for x in 0..grid.width() {
        for y in 0..grid.height() {
            let point = Point::at(x, y);

            grid.set(point, grid.get(point) + 1);
            if grid.get(point) > 9 {
                pending_flashes.push(point);
            }
        }
    }

    while let Some(flash) = pending_flashes.pop() {
        for neighbour in grid.get_8_neighbours(flash) {
            grid.set(neighbour, grid.get(neighbour) + 1);
            if grid.get(neighbour) > 9
                && !pending_flashes.contains(&neighbour)
                && !flashed.contains(&neighbour)
            {
                pending_flashes.push(neighbour);
            }
        }

        flashed.push(flash);
        flash_count += 1;
    }

    flashed.iter().for_each(|f| grid.set(*f, 0));

    flash_count
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        let input = "5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526";

        assert_eq!(part1(input), 1656);
    }

    #[test]
    fn test_part_2() {
        let input = "5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526";

        let synch = part2(input);
        assert_eq!(synch, 195);
    }
}
