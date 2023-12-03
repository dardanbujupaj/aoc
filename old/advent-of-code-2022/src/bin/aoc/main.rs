use chrono::{Datelike, Utc};
use clap::{Parser, Subcommand};
use std::{error::Error, process::Command};

mod init;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[command(subcommand)]
    command: Commands,

    day: Option<u32>,

    year: Option<u32>,
}

#[derive(Debug, Subcommand)]
enum Commands {
    #[command()]
    Init,
    #[command()]
    Solve,
}

fn main() -> Result<(), Box<dyn Error>> {
    let args = Args::parse();

    let datetime = Utc::now();
    let day = args.day.unwrap_or_else(|| datetime.day());
    let year = args.year.unwrap_or_else(|| datetime.year() as u32);

    match args.command {
        Commands::Init => {
            init::init_template(year, day)?;
        }
        Commands::Solve => {
            println!("solve {year} {day}");
            let output = Command::new("cargo")
                .args([
                    "run",
                    "--release",
                    "--bin",
                    format!("{year}_{day:0>2}").as_str(),
                ])
                .output()?;

            println!("{}", String::from_utf8(output.stderr).unwrap());
            println!("{}", String::from_utf8(output.stdout).unwrap());
        }
    }

    Ok(())
}
