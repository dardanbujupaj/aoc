use crate::{include_input, time};
use std::collections::HashMap;

type Rules = HashMap<(char, char), char>;

pub fn extended_polymerization() {
    println!("Processing polymerization");

    let input = include_input!("extended_polymerization");
    println!(
        "Polymer difference {} (Part 1)",
        time!("Part 1", part1(input))
    );
    println!(
        "Polymer difference {} (Part 2)",
        time!("Part 2", part2(input))
    );
}

fn part1(input: &str) -> isize {
    simulate_poymerization(input, 10)
}

fn part2(input: &str) -> isize {
    simulate_poymerization(input, 40)
}

fn simulate_poymerization(input: &str, iterations: usize) -> isize {
    let (input_polymer, rules) = parse_input(input);

    let mut element_count: HashMap<char, isize> = input_polymer
        .chars()
        .map(|c| (c, input_polymer.matches(c).count() as isize))
        .collect();

    let mut pairs: HashMap<(char, char), isize> = HashMap::new();
    for (l, r) in rules.keys() {
        pairs.insert(
            (*l, *r),
            input_polymer
                .matches(format!("{}{}", l, r).as_str())
                .count() as isize,
        );
    }

    for _ in 0..iterations {
        for (pair, count) in pairs.clone() {
            let new_element = *rules.get(&pair).unwrap();
            element_count.insert(
                new_element,
                element_count.get(&new_element).unwrap_or(&0) + count,
            );
            pairs.insert(pair, pairs.get(&pair).unwrap() - count);
            let (l, r) = pair;
            pairs.insert(
                (l, new_element),
                pairs.get(&(l, new_element)).unwrap() + count,
            );
            pairs.insert(
                (new_element, r),
                pairs.get(&(new_element, r)).unwrap() + count,
            );
        }
    }

    let mut counts: Vec<isize> = element_count.iter().map(|(_k, v)| *v).collect();
    counts.sort_unstable();
    counts[counts.len() - 1] - counts[0]
}

fn parse_input(input: &str) -> (&str, Rules) {
    let polymer = input.lines().take(1).next().expect("Polymer not found...");

    let rules: HashMap<(char, char), char> = input
        .lines()
        .skip(2)
        .map(|c| {
            let split: Vec<&str> = c.split(" -> ").collect();
            let mut pair_chars = split[0].chars();
            (
                (pair_chars.next().unwrap(), pair_chars.next().unwrap()),
                split[1].chars().next().unwrap(),
            )
        })
        .collect();

    (polymer, rules)
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C";

    #[test]
    fn test_parse_input() {
        let input = "NNCB

CH -> B
HH -> N";

        let mut expected_rules = HashMap::new();
        expected_rules.insert(('C', 'H'), 'B');
        expected_rules.insert(('H', 'H'), 'N');

        let (polymer, rules) = parse_input(input);
        assert_eq!(polymer, "NNCB");
        assert_eq!(rules, expected_rules);
    }

    #[test]
    fn test_part_1() {
        assert_eq!(part1(EXAMPLE_INPUT), 1588);
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part2(EXAMPLE_INPUT), 2188189693529);
    }
}
