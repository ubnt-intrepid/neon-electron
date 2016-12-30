#![allow(improper_ctypes)]

#[macro_use]
extern crate neon;

extern crate base;

use neon::vm::{Call, Lock, JsResult, This, FunctionCall};
use neon::js::{JsInteger, JsNumber, JsUndefined, Value};
use neon::js::binary::JsBuffer;

trait CheckArgument<'a> {
    fn check_argument<V: Value>(&mut self, i: i32) -> JsResult<'a, V>;
}

impl<'a, T: This> CheckArgument<'a> for FunctionCall<'a, T> {
    fn check_argument<V: Value>(&mut self, i: i32) -> JsResult<'a, V> {
        self.arguments.require(self.scope, i)?.check::<V>()
    }
}

fn mandelbrot(mut call: Call) -> JsResult<JsUndefined> {
    let mut buffer = call.check_argument::<JsBuffer>(0)?;
    let width = call.check_argument::<JsInteger>(1)?.value();
    let height = call.check_argument::<JsInteger>(2)?.value();
    let pixel_size = call.check_argument::<JsNumber>(3)?.value();
    let x0 = call.check_argument::<JsNumber>(4)?.value();
    let y0 = call.check_argument::<JsNumber>(5)?.value();

    buffer.grab(|mut buf| base::mandelbrot(buf.as_mut_slice(), width, height, pixel_size, x0, y0));

    Ok(JsUndefined::new())
}

register_module!(m, {
    m.export("mandelbrot", mandelbrot)
});
