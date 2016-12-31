// native backend built by neon-cli.
module Native {
  const Raw = require('./native');

  export class Backend {
    call(canvas:any, context:any, image:any, pixel_size: number, x0: number, y0: number) {
      let buffer = Buffer.from(image.data.buffer);
      Raw.mandelbrot(buffer, canvas.width, canvas.height, pixel_size, x0, y0);
      context.putImageData(image, 0, 0);
    }

    dispose() {}
  }
}

// Asm.js backend built by Emscripten toolchain.
module AsmJs {
  const Raw = require('./wasm');

  const _mandelbrot =
    Raw.cwrap('mandelbrot',
              undefined,
              ['number', 'number', 'number', 'number', 'number', 'number', 'number']);

  function allocateArray(n_bytes: number): Uint8ClampedArray {
    let ptr = Raw._malloc(n_bytes);
    return new Uint8ClampedArray(Raw.HEAPU8.buffer, ptr, n_bytes);
  }

  export class Backend {
    call(canvas:any, context:any, image:any, pixel_size: number, x0: number, y0: number) {
      // Create a heap to interact with Emscripten's function
      let buffer = allocateArray(image.data.buffer.byteLength);

      // Call function
      _mandelbrot(buffer.byteOffset, buffer.length, canvas.width, canvas.height, pixel_size, x0, y0);

      image.data.set(buffer);
      context.putImageData(image, 0, 0);

      // Free memory.
      Raw._free(buffer.byteOffset);
    }

    dispose() {}
  }
}


export enum BackendType {
  Native, // use native module
  AsmJs,  // use Asm.js
}

type Backend = Native.Backend | AsmJs.Backend;


export class MandelbrotRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly image: ImageData;
  backend: [BackendType, Backend];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.image = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.backend = [BackendType.Native, new Native.Backend()];
  }

  switchBackend(backendType: BackendType) {
    if (backendType === this.backend[0]) {
      return;
    }

    this.backend[0] = backendType;
    this.backend[1].dispose();
    switch (backendType) {
      case BackendType.Native:
        console.log("[debug] switch to Native.Backend");
        this.backend[1] = new Native.Backend();
        break;
      case BackendType.AsmJs:
        console.log("[debug] switch to AsmJs.Backend");
        this.backend[2] = new AsmJs.Backend();
        break;
    }
  }

  apply(pixel_size: number, x0: number, y0: number): void {
    this.backend[1].call(this.canvas, this.context, this.image, pixel_size, x0, y0);
  }
}
