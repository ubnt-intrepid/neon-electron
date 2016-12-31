export module Native {
  export const addon = require('./native');

  export class Backend {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly image: ImageData;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.image = this.context.getImageData(0, 0, canvas.width, canvas.height);
    }

    call(pixel_size: number, x0: number, y0: number) {
      let buffer = Buffer.from(this.image.data.buffer);

      addon.mandelbrot(buffer, this.canvas.width, this.canvas.height, pixel_size, x0, y0);

      this.context.putImageData(this.image, 0, 0);
    }
  }
}

export module AsmJs {
  export const Module = require('./wasm');

  const _mandelbrot =
    Module.cwrap('mandelbrot',
                 undefined,
                 ['number', 'number', 'number', 'number', 'number', 'number', 'number']);

  export class Backend {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly image: ImageData;
    readonly byteOffset: number;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
      this.image = this.context.getImageData(0, 0, canvas.width, canvas.height);
    }

    call(pixel_size: number, x0: number, y0: number) {
      // Create a heap to interact with Emscripten's function
      let buffer = ((() => {
        let n_bytes = this.image.data.buffer.byteLength;
        let ptr = Module._malloc(n_bytes);
        return new Uint8ClampedArray(Module.HEAPU8.buffer, ptr, n_bytes);
      })());

      // Call function
      _mandelbrot(buffer.byteOffset, buffer.length, this.canvas.width, this.canvas.height, pixel_size, x0, y0);

      this.image.data.set(buffer);
      this.context.putImageData(this.image, 0, 0);

      // Free memory.
      Module._free(buffer.byteOffset);
    }
  }
}
