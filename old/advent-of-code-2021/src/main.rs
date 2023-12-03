use clap::Parser;

use aoc::puzzles::*;

#[derive(Parser)]
#[clap(author = "Dardan Bujupaj")]
struct Opts {
    day: u8,
}

fn main() {
    let opts: Opts = Opts::parse();

    match opts.day {
        1 => sonar_sweep(),
        2 => dive(),
        3 => binary_diagnostic(),
        5 => hydrothermal_venture(),
        6 => lanternfish(),
        7 => whale(),
        8 => seven_segment(),
        9 => smoke_basin(),
        10 => syntax_scoring(),
        11 => dumbo_octopus(),
        14 => extended_polymerization(),
        15 => chiton(),
        16 => packet_decoder(),
        17 => trick_shot(),
        20 => trench_map(),
        21 => dirac_dice(),
        22 => reactor_reboot(),
        _ => unimplemented!(),
    }
}
