use aoc::{client::get_input};
use std::{cell::RefCell, error::Error, rc::Rc, collections::HashMap};

#[derive(Debug, PartialEq, Eq)]
struct Folder {
    parent: Option<Rc<RefCell<Folder>>>,
    name: String,
    size: usize,
    children: Vec<Rc<RefCell<Folder>>>,
}

impl Folder {
    fn new(name: String, size: usize, parent: Option<Rc<RefCell<Folder>>>) -> Self {

        let mut folder = Self {
            parent,
            name,
            size: 0,
            children: vec![],
        };

        folder.increase_size(size);

        folder
    }

    fn increase_size(&mut self, additional_size: usize) {
        self.size += additional_size;

        let mut next_parent = self.parent.clone();

        while let Some(current_parent) = next_parent {
            current_parent.borrow_mut().size += additional_size;
            next_parent = current_parent.borrow().parent.clone()
        }
    }
}

fn parse_input(input: &str) -> Result<HashMap<&str, Rc<RefCell<Folder>>>, Box<dyn Error>> {
    let mut nodes = HashMap::new();

    let root = Rc::new(RefCell::new(Folder::new(String::from("/"), 0, None)));

    let mut current_node = Rc::clone(&root);

    nodes.insert("/", root);

    let cd_matcher = regex::Regex::new(r"^\$ cd ([a-z]+)$")?;
    let dir_matcher = regex::Regex::new(r"^dir ([a-z]+)$")?;
    let file_matcher = regex::Regex::new(r"^(\d+) ([a-z.]+)$")?;

    input.lines().for_each(|line| {
        if let Some(captures) = cd_matcher.captures(line) {
            let dir_name = captures.get(1).unwrap().as_str();
            current_node = Rc::clone(nodes.get(dir_name).unwrap());
        } else if let Some(captures) = dir_matcher.captures(line) {
            let dir_name = captures.get(1).unwrap().as_str();
            // TODO add directory
        } else if let Some(captures) = file_matcher.captures(line) {
            let file_size = captures.get(1).unwrap().as_str().parse::<usize>();
            current_node.get_mut().increase_size(file_size.unwrap());
        }
    });

    nodes.insert("test", Rc::new(RefCell::new(Folder::new(
        String::from("test"),
        100,
        Some(Rc::clone(&current_node)),
    ))));

    println!("{nodes:?}");

    Ok(nodes)
}

fn main() -> Result<(), Box<dyn Error>> {
    let input = get_input(2022, 7)?;
    println!("solution part 1: {}", part_1(&input));
    println!("solution part 2: {}", part_2(&input));

    Ok(())
}

fn part_1(input: &str) -> String {
    let fs_nodes = parse_input(&input);

    unimplemented!()
}

fn part_2(input: &str) -> String {
    unimplemented!();
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_INPUT: &str = "$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k";

    #[test]
    fn test_part_1() {
        assert_eq!(part_1(TEST_INPUT), "95437")
    }

    #[test]
    fn test_part_2() {
        assert_eq!(part_2(TEST_INPUT), "")
    }
}
