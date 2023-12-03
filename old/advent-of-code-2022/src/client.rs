use reqwest::{blocking::Client, cookie::Jar, Url};
use std::{env, error::Error, io, path::Path, sync::Arc};

const INPUT_CACHE_FOLDER: &str = "./.input/";

fn get_aoc_client() -> Result<Client, Box<dyn Error>> {
    let cookie = format!("session={}", env::var("AOC_SESSION")?);

    let url = "https://adventofcode.com".parse::<Url>()?;

    let jar = Arc::new(Jar::default());
    jar.add_cookie_str(&cookie, &url);

    let client = Client::builder().cookie_provider(jar).build()?;

    Ok(client)
}

fn get_input_path(year: u32, day: u32) -> String {
    format!("{INPUT_CACHE_FOLDER}{year}_{day:0>2}.txt")
}

fn get_cached_input(year: u32, day: u32) -> Result<String, io::Error> {
    std::fs::read_to_string(get_input_path(year, day))
}

fn cache_input(year: u32, day: u32, input: &str) -> Result<(), io::Error> {
    let input_path = Path::new(INPUT_CACHE_FOLDER);

    if !std::path::Path::exists(input_path) {
        std::fs::create_dir(INPUT_CACHE_FOLDER)?;
    }

    std::fs::write(get_input_path(year, day), input)
}

/// download puzzle input
pub fn get_input(year: u32, day: u32) -> Result<String, Box<dyn Error>> {
    if let Ok(input) = get_cached_input(year, day) {
        return Ok(input);
    }

    println!("Downloading input for {year}-{day}");
    let client = get_aoc_client()?;

    let res = client
        .get(format!("https://adventofcode.com/{year}/day/{day}/input"))
        .send()?;

    let result = res.text()?;

    if let Err(error) = cache_input(year, day, &result) {
        println!("Error while caching file {}", error)
    }

    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_input_path() {
        assert_eq!("./.input/2022_01.txt", get_input_path(2022, 1))
    }
}
