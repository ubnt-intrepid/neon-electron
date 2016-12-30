import {Native} from 'mandelbrot';

declare var Module: any;
module Wasm {
  export function mandelbrot(canvas: HTMLCanvasElement, pixel_size: number, x0: number, y0: number): void {
    let context = canvas.getContext('2d');

    let width = canvas.width;
    let height = canvas.height;
    let n_bytes = width * height * 4;

    var image = context.createImageData(width, height);

    // allocate memory on Emscripten heap, and get pointer.
    let ptr = Module._malloc(n_bytes);

    // Copy data to Emscripten heap (directry accessed from Module.HEAPU8)
    var data_heap = new Uint8Array(Module.HEAPU8.buffer, ptr, n_bytes);

    // call function
    Module.ccall('mandelbrot', undefined,
                ['number', 'number', 'number', 'number', 'number', 'number', 'number'],
                [data_heap.byteOffset, data_heap.length, width, height, pixel_size, x0, y0]);

    image.data.set(new Uint8ClampedArray(data_heap.buffer, data_heap.byteOffset, data_heap.length));
    context.putImageData(image, 0, 0);

    // Free memory.
    Module._free(data_heap.byteOffset);
  }
}

class App {
  pixel_size: number;
  x0: number;
  y0: number;

  constructor(pixel_size: number, x0: number, y0: number) {
    this.pixel_size = pixel_size;
    this.x0 = x0;
    this.y0 = y0;
  }

  render() {
    var canvas = <HTMLCanvasElement> document.getElementById('screen');
    Wasm.mandelbrot(canvas, this.pixel_size, this.x0, this.y0);
  }
}

var app: App = null;

window.onload = () => {
  app = new App(0.01, -2.0, -1.0);

  var renderBtn = <HTMLButtonElement> document.getElementById('render');
  renderBtn.onclick = () => {
    app.render();
  };
};
