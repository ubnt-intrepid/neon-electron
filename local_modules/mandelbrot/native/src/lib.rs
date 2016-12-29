#![allow(improper_ctypes)]

#[macro_use]
extern crate neon;
#[macro_use]
extern crate itertools;

use neon::vm::{Call, Lock, JsResult, This, FunctionCall};
use neon::js::{JsInteger, JsNumber, JsUndefined, Value};
use neon::js::binary::JsBuffer;
use itertools::Itertools;
use std::cmp;

trait CheckArgument<'a> {
    fn check_argument<V: Value>(&mut self, i: i32) -> JsResult<'a, V>;
}

impl<'a, T: This> CheckArgument<'a> for FunctionCall<'a, T> {
    fn check_argument<V: Value>(&mut self, i: i32) -> JsResult<'a, V> {
        self.arguments.require(self.scope, i)?.check::<V>()
    }
}

fn run_mandelbrot(buffer: &mut [u8], width: i64, height: i64, pixel_size: f64, x0: f64, y0: f64) {
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

fn mandelbrot(mut call: Call) -> JsResult<JsUndefined> {
    let mut buffer = call.check_argument::<JsBuffer>(0)?;
    let width = call.check_argument::<JsInteger>(1)?.value();
    let height = call.check_argument::<JsInteger>(2)?.value();
    let pixel_size = call.check_argument::<JsNumber>(3)?.value();
    let x0 = call.check_argument::<JsNumber>(4)?.value();
    let y0 = call.check_argument::<JsNumber>(5)?.value();

    buffer.grab(|mut buf| run_mandelbrot(buf.as_mut_slice(), width, height, pixel_size, x0, y0));

    Ok(JsUndefined::new())
}

register_module!(m, {
    m.export("mandelbrot", mandelbrot)
});
