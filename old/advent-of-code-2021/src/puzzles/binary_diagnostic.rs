use crate::include_input;

pub fn binary_diagnostic() {
    println!("Running diagnostics...");
    let input = include_input!("sonar_sweep");

    let mut counter = BitCounter::new();

    for line in input.lines() {
        counter.count(line);
    }

    println!("{:?}", counter);
    println!("{}", counter.get_gamma());
    println!("{}", counter.get_epsilon());
    println!("{}", counter.get_gamma() * counter.get_epsilon());
}

#[derive(Debug)]
struct BitCounter {
    occurences: Vec<usize>,
    count: usize,
}

impl BitCounter {
    fn new() -> Self {
        BitCounter {
            occurences: Vec::new(),
            count: 0,
        }
    }

    fn count(&mut self, bits: &str) {
        if self.occurences.is_empty() {
            println!("{}: {}", bits, bits.chars().count());
            self.occurences = vec![0; bits.chars().count()];
        }

        self.count += 1;

        for i in 0..bits.chars().count() {
            if bits.chars().nth(i) == Some('1') {
                self.occurences[i] += 1;
            }
        }
    }

    fn get_gamma(&self) -> usize {
        let mut gamma = String::new();

        for i in 0..self.occurences.len() {
            if self.occurences[i] > self.count / 2 {
                gamma += "1";
            } else {
                gamma += "0";
            }
        }

        usize::from_str_radix(&gamma, 2).unwrap()
    }

    fn get_epsilon(&self) -> usize {
        let mut epsilon = String::new();

        for i in 0..self.occurences.len() {
            if self.occurences[i] <= self.count / 2 {
                epsilon += "1";
            } else {
                epsilon += "0";
            }
        }

        usize::from_str_radix(&epsilon, 2).unwrap()
    }
}
