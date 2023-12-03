use crate::include_input;

pub fn syntax_scoring() {
    println!("Checking syntax...");

    let input = include_input!("syntax_scoring");
    println!("Error score {}! (Part 1)", part1(input));
    println!("Completion score {}! (Part 2)", part2(input));
}

#[derive(Debug)]
struct BracketError {
    bracket: char,
}

impl BracketError {
    pub fn error_score(&self) -> usize {
        match &self.bracket {
            ')' => 3,
            ']' => 57,
            '}' => 1197,
            '>' => 25137,
            _ => panic!("Unknown bracket..."),
        }
    }
}

struct Chunk {
    start: char,
}

impl Chunk {
    /// Create a new chunk with the matching end char
    /// Panics on unknown start chars
    pub fn new(start: char) -> Result<Self, BracketError> {
        match start {
            ')' | '}' | ']' | '>' => Err(BracketError { bracket: start }),
            _ => Ok(Chunk { start }),
        }
    }

    pub fn expected_end(&self) -> char {
        match &self.start {
            '(' => ')',
            '{' => '}',
            '[' => ']',
            '<' => '>',
            _ => panic!("Unknown start bracket!"),
        }
    }

    pub fn complete_score(&self) -> usize {
        match &self.start {
            '(' => 1,
            '[' => 2,
            '{' => 3,
            '<' => 4,
            _ => panic!("Unknown start bracket!"),
        }
    }
}

fn part1(input: &str) -> usize {
    parse_brackets(input)
        .iter()
        .map(|r| match r {
            Ok(_) => 0,
            Err(e) => e.error_score(),
        })
        .sum()
}

fn part2(input: &str) -> usize {
    let mut scores: Vec<usize> = parse_brackets(input)
        .iter()
        .filter(|r| r.is_ok())
        .map(|r| match r {
            Ok(result) => {
                let mut score = 0;

                for chunk in result.iter().rev() {
                    score = score * 5 + chunk.complete_score();
                }

                score
            }
            Err(_) => panic!("Errors should be filtered by now..."),
        })
        .collect();

    scores.sort_unstable();
    println!("{:?}", scores);

    scores[scores.len() / 2]
}

fn parse_brackets(input: &str) -> Vec<Result<Vec<Chunk>, BracketError>> {
    input
        .lines()
        .map(|l| {
            let mut stack: Vec<Chunk> = Vec::new();
            for c in l.chars() {
                if let Some(current) = stack.last() {
                    if c == current.expected_end() {
                        stack.pop();
                        continue;
                    }
                }

                match Chunk::new(c) {
                    Ok(chunk) => stack.push(chunk),
                    Err(e) => return Err(e),
                }
            }

            Ok(stack)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solution() {
        syntax_scoring();
    }

    #[test]
    fn test_part_1() {
        let input = include_input!("syntax_scoring_example");
        assert_eq!(part1(input), 26397);
    }

    #[test]
    fn test_part_2() {
        let input = include_input!("syntax_scoring_example");
        assert_eq!(part2(input), 288957);
    }
}
