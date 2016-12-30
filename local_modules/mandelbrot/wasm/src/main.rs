#![feature(link_args)]

#[link_args = "-s EXPORTED_FUNCTIONS=['_mandelbrot']"]
extern "C" {}

extern crate base;

#[no_mangle]
pub fn mandelbrot(buffer: &mut [u8], width: i64, height: i64, pixel_size: f64, x0: f64, y0: f64) {
    base::mandelbrot(buffer, width, height, pixel_size, x0, y0);
}

fn main() {
    //* Intentionally left blank.
}
