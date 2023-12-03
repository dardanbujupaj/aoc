use std::collections::HashSet;

use crate::include_input;

pub fn seven_segment() {
    println!("Counting segments");
    let input = include_input!("seven_segment");
    println!("Count 1,4,7,8 (Part 1): {}", part_1(input));
    println!("Sum up outputs (Part 2): {}", part_2(input));
}

/// count 1, 4, 7, 8
fn part_1(input: &str) -> usize {
    let count: usize = input
        .lines()
        .map(Entry::parse)
        .map(|e| {
            e.output
                .iter()
                .filter(|x| vec![1, 4, 7, 8].contains(x))
                .count()
        })
        .sum();

    count
}

/// count 1, 4, 7, 8
fn part_2(input: &str) -> usize {
    let count: usize = input
        .lines()
        .map(Entry::parse)
        .map(|e| {
            e.output[0] as usize * 1000
                + e.output[1] as usize * 100
                + e.output[2] as usize * 10
                + e.output[3] as usize
        })
        .sum();

    count
}

#[derive(Debug, PartialEq, Eq)]
struct Entry {
    input: Vec<u8>,
    output: Vec<u8>,
}

impl Entry {
    pub fn parse(input: &str) -> Self {
        let input_output: Vec<&str> = input.split(" | ").collect();
        let segment = Segment::from_input(input_output[0]);
        let input = input_output[0]
            .split_whitespace()
            .map(|seq| segment.parse_value(seq))
            .collect();
        let output = input_output[1]
            .split_whitespace()
            .map(|seq| segment.parse_value(seq))
            .collect();

        Entry { input, output }
    }
}

#[derive(Debug)]
struct Segment {
    segments: Vec<HashSet<char>>,
}

impl Segment {
    fn from_input(input: &str) -> Segment {
        let segment_sequences: Vec<HashSet<char>> = input
            .split_whitespace()
            .map(|seq| seq.chars().collect())
            .collect();

        let mut segments = vec![HashSet::new(); 10];

        segments[1] = segment_sequences
            .iter()
            .find(|s| s.len() == 2)
            .unwrap()
            .clone();
        segments[4] = segment_sequences
            .iter()
            .find(|s| s.len() == 4)
            .unwrap()
            .clone();
        segments[7] = segment_sequences
            .iter()
            .find(|s| s.len() == 3)
            .unwrap()
            .clone();
        segments[8] = segment_sequences
            .iter()
            .find(|s| s.len() == 7)
            .unwrap()
            .clone();

        segments[3] = segment_sequences
            .iter()
            .find(|s| s.len() == 5 && s.is_superset(&segments[1]) && s.is_superset(&segments[7]))
            .unwrap()
            .clone();

        segments[9] = segment_sequences
            .iter()
            .find(|s| s.len() == 6 && s.is_superset(&segments[3]))
            .unwrap()
            .clone();

        segments[0] = segment_sequences
            .iter()
            .find(|s| {
                s.len() == 6
                    && s.is_subset(&segments[8])
                    && s.is_superset(&segments[7])
                    && s.symmetric_difference(&segments[9]).count() != 0
            })
            .unwrap()
            .clone();

        segments[6] = segment_sequences
            .iter()
            .find(|s| {
                s.len() == 6
                    && s.symmetric_difference(&segments[0]).count() != 0
                    && s.symmetric_difference(&segments[9]).count() != 0
            })
            .unwrap()
            .clone();

        segments[5] = segment_sequences
            .iter()
            .find(|s| s.len() == 5 && s.is_subset(&segments[6]))
            .unwrap()
            .clone();

        segments[2] = segment_sequences
            .iter()
            .find(|s| {
                s.len() == 5
                    && s.symmetric_difference(&segments[3]).count() != 0
                    && s.symmetric_difference(&segments[5]).count() != 0
            })
            .unwrap()
            .clone();

        Segment { segments }
    }

    fn parse_value(&self, input: &str) -> u8 {
        let charset: HashSet<char> = input.chars().collect();

        for (i, el) in self.segments.iter().enumerate() {
            if el.symmetric_difference(&charset).count() == 0 {
                return i as u8;
            }
        }

        println!("{:?} not fount in segment {:?}", charset, self.segments);

        u8::MAX
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_entry() {
        let entry_sequence =
            "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf";
        let expected_entry = Entry {
            input: vec![8, 5, 2, 3, 7, 9, 6, 4, 0, 1],
            output: vec![5, 3, 5, 3],
        };

        assert_eq!(Entry::parse(entry_sequence), expected_entry);
    }

    #[test]
    fn test_part_1() {
        let entry_sequence =
            "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
                .to_string();

        assert_eq!(part_1(&entry_sequence), 0);
    }

    #[test]
    fn test_part_2() {
        let entry_sequence =
            "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
                .to_string();

        assert_eq!(part_2(&entry_sequence), 5353);
    }
}
