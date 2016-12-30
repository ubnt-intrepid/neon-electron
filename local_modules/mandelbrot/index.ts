export module Native {
  export const addon = require('./native');

  export function mandelbrot(image: ImageData, pixel_size: number, x0: number, y0: number): void {
    let buffer = new Buffer(image.data.buffer);
    addon.mandelbrot(buffer, image.width, image.height, pixel_size, x0, y0);
  }
}

export module Wasm {
  export const addon = require('./wasm');

  export function mandelbrot(image: ImageData, pixel_size: number, x0: number, y0: number): void {
    addon.ccall('mandelbrot', 'void',
                ['array', 'number', 'number', 'number', 'number', 'number'],
                [image.data, image.width, image.height, pixel_size, x0, y0]);
  }
}
