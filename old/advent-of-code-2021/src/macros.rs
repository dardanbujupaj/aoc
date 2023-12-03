/// Macro for timing functions
///
/// Executes the expression and measures the time it takes to run.
///
/// # Examples
///
/// ```
/// use aoc::time;
///
/// // Prints '🚀 Print text: 42ns'
/// let result = time!("Print text", 1 + 2);
/// assert_eq!(result, 3);
///
/// ```
///
#[macro_export]
macro_rules! time {
    ( $n:literal, $x:expr ) => {{
        let start = std::time::Instant::now();
        let result = $x;
        let elapsed = start.elapsed();
        println!("🚀 {}: {:?}", $n, elapsed);
        result
    }};
}

/// import one of the inputs from the inputs folder
#[macro_export]
macro_rules! include_input {
    ( $n:literal ) => {{
        include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/inputs/", $n, ".txt"))
    }};
}

#[macro_export]
macro_rules! gauss {
    ( $n:expr ) => {
        $n * ($n + 1) / 2
    };
}

#[cfg(test)]
mod tests {

    #[test]
    fn test_gauss() {
        assert_eq!(gauss!(5), 1 + 2 + 3 + 4 + 5)
    }
}
