use std::{fs::write, io::Error};

pub fn init_template(year: u32, day: u32) -> Result<(), Error> {
    let filename = format!("./src/bin/{}_{:0>2}.rs", year, day);

    let template = format!(
        "use aoc::client::get_input;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {{
    let input = get_input({year}, {day})?;
    println!(\"solution part 1: {{}}\", part_1(&input)?);
    println!(\"solution part 2: {{}}\", part_2(&input)?);

    Ok(())
}}

fn part_1(input: &str) -> Result<String, Box<dyn Error>> {{
    unimplemented!();
}}

fn part_2(input: &str) -> Result<String, Box<dyn Error>> {{
    unimplemented!();
}}

#[cfg(test)]
mod tests {{
    use super::*;

    const TEST_INPUT: &str = \"\";

    #[test]
    fn test_part_1() {{
        assert_eq!(part_1(TEST_INPUT).unwrap(), \"\")
    }}

    #[test]
    fn test_part_2() {{
        assert_eq!(part_2(TEST_INPUT).unwrap(), \"\")
    }}
}}
"
    );

    write(filename, template)
}
