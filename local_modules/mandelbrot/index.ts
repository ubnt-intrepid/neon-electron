// native backend built by neon-cli.
module Native {
  const Raw = require('./native');

  export class Backend {
    call(image: ImageData, width: number, height: number, pixel_size: number, x0: number, y0: number) {
      Raw.mandelbrot(Buffer.from(image.data.buffer), width, height, pixel_size, x0, y0);
    }

    getType(): BackendType {
      return BackendType.Native;
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

  export class Backend {
    buffer: Uint8ClampedArray;

    constructor(n_bytes: number) {
      // Create a heap to interact with Emscripten's function
      let ptr = Raw._malloc(n_bytes);
      this.buffer = new Uint8ClampedArray(Raw.HEAPU8.buffer, ptr, n_bytes);
    }

    call(image: ImageData, width: number, height: number, pixel_size: number, x0: number, y0: number) {
      if (this.buffer === null) {
        return;
      }
      _mandelbrot(this.buffer.byteOffset, this.buffer.length, width, height, pixel_size, x0, y0);
      image.data.set(this.buffer);
    }

    getType(): BackendType {
      return BackendType.AsmJs;
    }

    dispose() {
      if (this.buffer !== null) {
        // Free memory.
        Raw._free(this.buffer.byteOffset);
        this.buffer = null;
      }
    }
  }
}

export enum BackendType {
  Native, // use native module
  AsmJs,  // use Asm.js
}

type Backend = Native.Backend | AsmJs.Backend;


export class MandelbrotRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  image: ImageData;
  backend: Backend;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.image = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.backend = new Native.Backend();

    document.addEventListener('close', () => {
      this.backend.dispose();
    });
  }

  switchBackend(backendType: BackendType) {
    if (backendType === this.backend.getType()) {
      return;
    }

    this.backend.dispose();
    switch (backendType) {
      case BackendType.Native:
        console.log("[debug] switch to Native.Backend");
        this.backend = new Native.Backend();
        break;
      case BackendType.AsmJs:
        console.log("[debug] switch to AsmJs.Backend");
        let n_bytes = this.image.data.buffer.byteLength;
        this.backend = new AsmJs.Backend(n_bytes);
        break;
    }
  }

  apply(pixel_size: number, x0: number, y0: number): void {
    this.backend.call(this.image, this.canvas.width, this.canvas.height, pixel_size, x0, y0);
    this.context.putImageData(this.image, 0, 0);
  }
}
