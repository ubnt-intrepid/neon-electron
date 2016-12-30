export module Native {
  export const addon = require('./native');

  export function mandelbrot(canvas: HTMLCanvasElement, pixel_size: number, x0: number, y0: number): void {
    console.log("[debug] call Native.mandelbrot()");

    var buffer = new Buffer(canvas.width * canvas.height * 4);
    addon.mandelbrot(buffer, canvas.width, canvas.height, pixel_size, x0, y0);

    var image = new ImageData(canvas.width, canvas.height);
    image.data.set(new Uint8ClampedArray(buffer));

    canvas.getContext('2d').putImageData(image, 0, 0);
  }
}

export module Wasm {
  export const Module = require('./wasm');

  export function mandelbrot(canvas: HTMLCanvasElement, pixel_size: number, x0: number, y0: number): void {
    console.log("[debug] call Wasm.mandelbrot()");

    // Allocate memory on Emscripten heap, and get pointer.
    let n_bytes = canvas.width * canvas.height * 4;
    let ptr = Module._malloc(n_bytes);
    // Copy data to Emscripten heap (directry accessed from Module.HEAPU8)
    var data_heap = new Uint8Array(Module.HEAPU8.buffer, ptr, n_bytes);
    // Call function
    Module.ccall('mandelbrot', undefined,
                ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
                [data_heap.byteOffset, data_heap.length, canvas.width, canvas.height, pixel_size, x0, y0]);

    // create the instance of ImageData.
    var image = new ImageData(canvas.width, canvas.height);
    image.data.set(new Uint8ClampedArray(data_heap.buffer, data_heap.byteOffset, data_heap.length));
    // Free memory.
    Module._free(data_heap.byteOffset);

    canvas.getContext('2d').putImageData(image, 0, 0);
  }
}
