use aoc::client::get_input;
use std::{
    collections::{HashSet, VecDeque},
    error::Error,
};

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 6)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

fn find_marker_end(message: &str, marker_length: usize) -> usize {
    let mut matcher: VecDeque<char> = VecDeque::with_capacity(marker_length);

    message
        .chars()
        .take_while(|c| {
            let set: HashSet<char> = HashSet::from_iter(matcher.iter().copied());

            if set.len() >= marker_length {
                return false;
            }

            if matcher.len() >= marker_length {
                matcher.pop_front();
            }
            matcher.push_back(*c);

            true
        })
        .count()
}

fn part_1(input: &str) -> String {
    format!("{}", find_marker_end(input, 4))
}

fn part_2(input: &str) -> String {
    format!("{}", find_marker_end(input, 14))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_part_1() {
        assert_eq!(part_1("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), "7");
        assert_eq!(part_1("bvwbjplbgvbhsrlpgdmjqwftvncz"), "5");
        assert_eq!(part_1("nppdvjthqldpwncqszvftbrmjlhg"), "6");
        assert_eq!(part_1("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), "10");
        assert_eq!(part_1("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), "11");
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), "19");
        assert_eq!(part_2("bvwbjplbgvbhsrlpgdmjqwftvncz"), "23");
        assert_eq!(part_2("nppdvjthqldpwncqszvftbrmjlhg"), "23");
        assert_eq!(part_2("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), "29");
        assert_eq!(part_2("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), "26");
    }
}
