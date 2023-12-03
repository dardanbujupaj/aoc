use crate::include_input;

pub fn sonar_sweep() {
    let input = include_input!("sonar_sweep");

    println!("Analyzing sonar sweep...");
    println!("Input: {}", input);

    let measurements: Vec<isize> = parse_input(input);
    println!("Measurements: {:?}", measurements);

    let increases = count_increases(&measurements);

    println!("Increases (Part 1): {}", increases);

    let increases_2 = count_increases(&windowed(&measurements, 3));

    println!("Increases (Part 2): {}", increases_2);
}

pub fn windowed(measurements: &[isize], size: usize) -> Vec<isize> {
    measurements.windows(size).map(|w| w.iter().sum()).collect()
}

fn count_increases(measurements: &[isize]) -> isize {
    let mut count = 0;

    for i in 1..measurements.len() {
        if measurements[i] > measurements[i - 1] {
            count += 1;
        }
    }

    count
}

fn parse_input(input: &str) -> Vec<isize> {
    input
        .split_whitespace()
        .map(|x| x.parse::<isize>().unwrap())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "199
    200
    208
    210
    200
    207
    240
    269
    260
    263";

    fn get_example_measurements() -> Vec<isize> {
        vec![199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
    }

    #[test]
    fn test_parse() {
        let input = EXAMPLE_INPUT;

        assert_eq!(get_example_measurements(), parse_input(input));
    }

    #[test]
    fn test_increases() {
        assert_eq!(count_increases(&get_example_measurements()), 7);
    }

    #[test]
    fn test_windowed() {
        assert_eq!(windowed(&[2, 2, 1, 1], 2), vec![4, 3, 2]);
    }
}
