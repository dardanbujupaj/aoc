use crate::{include_input, time};

pub fn packet_decoder() {
    println!("Decoding packets...");
    let input = include_input!("packet_decoder");

    println!("Version sum: {} (Part 1)", time!("Part 1", part1(input)));
    println!("Value: {} (Part 2)", time!("Part 2", part2(input)));
}

fn part1(input: &str) -> usize {
    let packet = decode_message(input);

    sum_packet_versions(&packet)
}

fn sum_packet_versions(packet: &Packet) -> usize {
    packet.version
        + packet
            .sub_packets
            .iter()
            .map(sum_packet_versions)
            .sum::<usize>()
}

fn part2(input: &str) -> usize {
    let packet = decode_message(input);

    packet.value()
}

#[derive(Debug)]
struct Packet {
    version: usize,
    type_id: usize,
    length: usize,
    value: usize,
    sub_packets: Vec<Packet>,
}

impl Packet {
    /// parses a packet from a binary string
    fn parse(input: &str) -> Self {
        let version = usize::from_str_radix(&input[0..3], 2).unwrap();
        let type_id = usize::from_str_radix(&input[3..6], 2).unwrap();

        let (length, value, sub_packets) = if type_id == 4 {
            let mut literal = String::new();
            // first four bits start at 7
            let mut position = 6;
            loop {
                literal.push_str(&input[position + 1..position + 5]);

                if &input[position..position + 1] == "0" {
                    break;
                } else {
                    position += 5;
                }
            }

            let value = usize::from_str_radix(&literal, 2).unwrap();
            (position + 5, value, Vec::new())
        } else {
            // length type ID
            let offset_with_length = 7 + 15;
            let offset_with_num = 7 + 11;
            let length_type_id = &input[6..7];

            let (data_offset, length) = match length_type_id {
                "0" => (
                    offset_with_length,
                    usize::from_str_radix(&input[7..offset_with_length], 2).unwrap(),
                ),
                "1" => (
                    offset_with_num,
                    usize::from_str_radix(&input[7..offset_with_num], 2).unwrap(),
                ),
                _ => unimplemented!(),
            };

            let mut data_position = data_offset;
            let mut sub_packets = Vec::new();

            for _ in 0..length {
                let packet = Packet::parse(&input[data_position..]);
                data_position += packet.length;
                sub_packets.push(packet);

                // stop if length of subpackets matches total length
                let sub_packets_length =
                    sub_packets.iter().map(|p: &Packet| p.length).sum::<usize>();
                if length_type_id == "0" && sub_packets_length >= length {
                    break;
                }
            }

            let value = 0;
            // calculate length from header and subpackets
            let actual_length =
                data_offset + sub_packets.iter().map(|p: &Packet| p.length).sum::<usize>();

            (actual_length, value, sub_packets)
        };

        Packet {
            version,
            type_id,
            length,
            value,
            sub_packets,
        }
    }

    fn value(&self) -> usize {
        match self.type_id {
            // sum
            0 => self.sub_packets.iter().map(|p| p.value()).sum(),
            // product
            1 => self.sub_packets.iter().map(|p| p.value()).product(),
            // min
            2 => self.sub_packets.iter().map(|p| p.value()).min().unwrap(),
            // max
            3 => self.sub_packets.iter().map(|p| p.value()).max().unwrap(),
            // literal
            4 => self.value,
            // gt
            5 => {
                if self.sub_packets[0].value() > self.sub_packets[1].value() {
                    1
                } else {
                    0
                }
            }
            // lt
            6 => {
                if self.sub_packets[0].value() < self.sub_packets[1].value() {
                    1
                } else {
                    0
                }
            }
            // eq
            7 => {
                if self.sub_packets[0].value() == self.sub_packets[1].value() {
                    1
                } else {
                    0
                }
            }
            _ => unimplemented!(),
        }
    }
}

/// converts a hex string to its binary representation
fn hex2bin(hex: &str) -> String {
    let bin: String = hex
        .chars()
        .map(|f| {
            let hex_value = u8::from_str_radix(&f.to_string(), 16).expect("Not a hex value");
            format!("{:04b}", hex_value)
        })
        .collect();

    bin
}

fn decode_message(input: &str) -> Packet {
    // hex to binary
    let binary = hex2bin(input);

    Packet::parse(&binary)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solution() {
        packet_decoder();
    }

    #[should_panic]
    #[test]
    fn test_hex2bin() {
        assert_eq!(hex2bin("0"), "0000");
        assert_eq!(hex2bin("1"), "0001");
        assert_eq!(hex2bin("9"), "1001");
        assert_eq!(hex2bin("A"), "1001");
        assert_eq!(hex2bin("F"), "1111");
        assert_eq!(hex2bin("D2FE28"), "110100101111111000101000");

        // should panic
        hex2bin("G");
    }

    #[test]
    fn test_decode_message() {
        let packet = decode_message("8A004A801A8002F478");

        assert_eq!(packet.version, 4);
    }

    #[test]
    fn test_decode_literal_message() {
        let packet = decode_message("D2FE28");

        assert_eq!(packet.version, 6);
        assert_eq!(packet.type_id, 4);
        assert_eq!(packet.value, 2021);
    }

    #[test]
    fn test_part_1() {
        assert_eq!(part1("8A004A801A8002F478"), 16);
        assert_eq!(part1("620080001611562C8802118E34"), 12);
        assert_eq!(part1("C0015000016115A2E0802F182340"), 23);
        assert_eq!(part1("A0016C880162017C3686B18A3D4780"), 31);
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part2("C200B40A82"), 3);
        assert_eq!(part2("04005AC33890"), 54);
        assert_eq!(part2("880086C3E88112"), 7);
        assert_eq!(part2("CE00C43D881120"), 9);
        assert_eq!(part2("D8005AC2A8F0"), 1);
        assert_eq!(part2("F600BC2D8F"), 0);
        assert_eq!(part2("9C005AC2F8F0"), 0);
        assert_eq!(part2("9C0141080250320F1802104A08"), 1);
    }
}
