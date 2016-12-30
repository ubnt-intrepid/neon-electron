#![feature(link_args)]

#[link_args = "-s EXPORTED_FUNCTIONS=['_mandelbrot']"]
extern "C" {}

extern crate base;
use std::slice;

#[no_mangle]
pub fn mandelbrot(buffer: *mut u8,
                  len: usize,
                  width: f64,
                  height: f64,
                  pixel_size: f64,
                  x0: f64,
                  y0: f64) {
    let mut buffer = unsafe { slice::from_raw_parts_mut(buffer, len) };
    base::mandelbrot(buffer, width as i64, height as i64, pixel_size, x0, y0);
}

fn main() {
    // Intentionally left blank.
}
