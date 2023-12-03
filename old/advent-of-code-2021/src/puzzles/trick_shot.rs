use crate::{gauss, include_input, time, util::Point};

pub fn trick_shot() {
    println!(
        "Highest position: {} (Part 1)",
        time!("Part 1", part1(include_input!("trick_shot")))
    );
    println!(
        "Number of velocities: {} (Part 2)",
        time!("Part 2", part2(include_input!("trick_shot")))
    );
}

#[derive(Debug, PartialEq, Eq)]
struct Area {
    from_x: isize,
    from_y: isize,
    to_x: isize,
    to_y: isize,
}

fn part1(input: &str) -> isize {
    let area = parse_input(input);
    let y = -area.from_y - 1;

    gauss!(y)
}

/// 1. calculate which x-velocity values converge in the target x range. For these you can be sure that every y value in the target area mirrored around the x axis (-1) is a hit (we already learned that by solving part 1 analytically)
/// 2. for the same x values as in 1. I check if the trajectory lands in the target area after n steps for y = area.to_y..-area.to_y. Here I’m not sure if there’s a cleaner way.
/// 3. Then I take the area from the most upper right of the velocities of 1. to halfway through the most distant point of the target (all other points overshoot the target with the second iteration) and check if the land in the target after n steps.
/// 4. All the points in the target area are valid start velocities.
fn part2(input: &str) -> usize {
    let area = parse_input(input);

    let mut velocities: Vec<Point> = Vec::new();

    // find all possibilities where final x velocity is 0
    for x in find_perfect_x_velocities(area.from_x, area.to_x) {
        for y in area.to_y..-area.to_y {
            if hits_target(&area, Point::at(x, y)) {
                velocities.push(Point::at(x, y));
            }
        }

        // y reversed so that the last added velocity is the upper most right
        for y in (area.from_y..area.to_y).rev() {
            velocities.push(Point::at(x, -y - 1));
        }
    }

    let first_overshooting = velocities[velocities.len() - 1] + Point::at(1, 0);

    // All positions in the target area are valid start velocities
    for x in area.from_x..=area.to_x {
        for y in area.from_y..=area.to_y {
            velocities.push(Point::at(x, y));
        }
    }

    let last_halfway = Point::at(area.to_x / 2 + 1, area.from_y / 2 + 1);

    for x in first_overshooting.x..=last_halfway.x {
        for y in last_halfway.y..=first_overshooting.y {
            if hits_target(&area, Point::at(x, y)) {
                velocities.push(Point::at(x, y));
            }
        }
    }

    velocities.len()
}

fn find_perfect_x_velocities(from_x: isize, to_x: isize) -> Vec<isize> {
    let mut velocities: Vec<isize> = Vec::new();
    for x in from_x..=to_x {
        let vx = (-1.0 + ((1 + 8 * x) as f64).sqrt()) / 2.0;
        if vx == vx.round() {
            velocities.push(vx as isize);
        }
    }

    velocities
}

fn parse_input(input: &str) -> Area {
    let elements: Vec<&str> = input.split(&['=', '.', ','][..]).collect();

    Area {
        from_x: elements[1].parse().unwrap(),
        to_x: elements[3].parse().unwrap(),
        from_y: elements[5].parse().unwrap(),
        to_y: elements[7].parse().unwrap(),
    }
}

fn hits_target(area: &Area, velocity: Point) -> bool {
    let mut pos = Point::new();
    let mut vel = velocity;
    loop {
        let (new_pos, new_velocity) = step(pos, vel);

        if new_pos.x > area.to_x || new_pos.y < area.from_y {
            // no hit possible
            break false;
        } else if new_pos.x >= area.from_x && new_pos.y <= area.to_y {
            // hit
            break true;
        } else {
            // iterate
            pos = new_pos;
            vel = new_velocity;
        }
    }
}

fn step(position: Point, velocity: Point) -> (Point, Point) {
    let new_position = position + velocity;

    let new_velocity = Point::at(
        match velocity.x {
            0 => 0,
            1.. => velocity.x - 1,
            _ => velocity.x + 1,
        },
        velocity.y - 1,
    );

    (new_position, new_velocity)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        assert_eq!(part1(include_input!("trick_shot_example")), 45);
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part2(include_input!("trick_shot_example")), 112);
    }

    #[test]
    fn test_find_perfect_x_velocities() {
        assert_eq!(find_perfect_x_velocities(20, 30), vec![6, 7]);
    }

    #[test]
    fn test_parse_input() {
        let expected_area = Area {
            from_x: 20,
            to_x: 30,
            from_y: -10,
            to_y: -5,
        };
        assert_eq!(
            parse_input(include_input!("trick_shot_example")),
            expected_area
        );
    }
}
