export module Native {
  export const addon = require('./native');

  export function mandelbrot(canvas: HTMLCanvasElement, pixel_size: number, x0: number, y0: number): void {
    console.log("[debug] call Native.mandelbrot()");

    var context = canvas.getContext('2d');

    var image = context.getImageData(0, 0, canvas.width, canvas.height);

    addon.mandelbrot(Buffer.from(image.data.buffer), canvas.width, canvas.height, pixel_size, x0, y0);

    context.putImageData(image, 0, 0);
  }
}

export module Wasm {
  export const Module = require('./wasm');

  const _mandelbrot = Module.cwrap('mandelbrot', undefined,
      ['number', 'number', 'number', 'number', 'number', 'number', 'number']);

  export function mandelbrot(canvas: HTMLCanvasElement, pixel_size: number, x0: number, y0: number): void {
    console.log("[debug] call Wasm.mandelbrot()");

    var context = canvas.getContext('2d');
    var image = context.getImageData(0, 0, canvas.width, canvas.height);

    let n_bytes = canvas.width * canvas.height * 4;
    // Create a heat to interact with Emscripten's function
    let ptr:number = Module._malloc(n_bytes);

    // Call function
    _mandelbrot(ptr, n_bytes, canvas.width, canvas.height, pixel_size, x0, y0);

    image.data.set(new Uint8ClampedArray(Module.HEAPU8.buffer, ptr, n_bytes));
    context.putImageData(image, 0, 0);

    // Free memory.
    Module._free(ptr);
  }
}
