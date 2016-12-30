#[macro_use]
extern crate itertools;

use std::cmp;
use itertools::Itertools;

pub fn mandelbrot(buffer: &mut [u8], width: i64, height: i64, pixel_size: f64, x0: f64, y0: f64) {
    iproduct!((0..width), (0..height)).foreach(|(i, j)| {
        let cr = x0 + pixel_size * (i as f64);
        let ci = y0 + pixel_size * (j as f64);

        let (mut zr, mut zi) = (0.0, 0.0);
        let k = (0..256)
            .take_while(|_| {
                let (zrzi, zr2, zi2) = (zr * zi, zr * zr, zi * zi);
                zr = zr2 - zi2 + cr;
                zi = zrzi + zrzi + ci;
                zi2 + zr2 < 2.0
            })
            .count();
        let k = cmp::min(255, k) as u8;

        let idx = (j * width + i) as usize;
        buffer[4 * idx] = 255 - k;
        buffer[4 * idx + 1] = 255 - k;
        buffer[4 * idx + 2] = 255 - k;
        buffer[4 * idx + 3] = 255;
    });
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {}
}
