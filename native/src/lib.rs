#![allow(improper_ctypes)]

#[macro_use]
extern crate neon;

use neon::vm::{Call, Lock, JsResult};
use neon::mem::Handle;
use neon::js::{JsInteger, JsNumber, JsUndefined};
use neon::js::binary::JsBuffer;

#[allow(unused_variables)]
fn run_mandelbrot(buffer: &mut [u8], width: i64, height: i64, pixel_size: f64, x0: f64, y0: f64) {
    for j in 0..height {
        for i in 0..width {
            let (cr, ci) = (x0 + pixel_size * (i as f64), y0 + pixel_size * (j as f64));

            let (mut zr, mut zi) = (0.0, 0.0);

            let mut k = 256;
            for _k in 0..256 {
                k = _k;
                let zrzi = zr * zi;
                let zr2 = zr * zr;
                let zi2 = zi * zi;
                zr = zr2 - zi2 + cr;
                zi = zrzi + zrzi + ci;
                if zi2 + zr2 >= 2.0 {
                    break;
                }
            }
            if k > 255 {
                k = 255;
            }

            let idx: usize = (j * width + i) as usize;
            buffer[4 * idx] = 255 - (k as u8);
            buffer[4 * idx + 1] = 255 - (k as u8);
            buffer[4 * idx + 2] = 255 - (k as u8);
            buffer[4 * idx + 3] = 255;
        }
    }
}

#[allow(unused_variables, unused_mut)]
fn mandelbrot(call: Call) -> JsResult<JsUndefined> {
    let scope = call.scope;

    let mut buffer: Handle<JsBuffer> = call.arguments
        .require(scope, 0)?
        .check::<JsBuffer>()?;

    let width: i64 = call.arguments
        .require(scope, 1)?
        .check::<JsInteger>()?
        .value();

    let height: i64 = call.arguments
        .require(scope, 2)?
        .check::<JsInteger>()?
        .value();

    let pixel_size: f64 = call.arguments
        .require(scope, 3)?
        .check::<JsNumber>()?
        .value();

    let x0: f64 = call.arguments
        .require(scope, 4)?
        .check::<JsNumber>()?
        .value();

    let y0: f64 = call.arguments
        .require(scope, 5)?
        .check::<JsNumber>()?
        .value();

    buffer.grab(|mut buf| run_mandelbrot(buf.as_mut_slice(), width, height, pixel_size, x0, y0));

    Ok(JsUndefined::new())
}

register_module!(m, {
    m.export("mandelbrot", mandelbrot)
});
