// native module built by neon-cli.
const Native = require('mandelbrot/native');
// Asm.js module built by Emscripten toolchain.
const AsmJs = require('mandelbrot/wasm');


interface IDisposable {
  dispose(): void;
}


// native backend built by neon-cli.
class NativeBackend implements IDisposable {
  call(image: ImageData, width: number, height: number, pixel_size: number, x0: number, y0: number): ImageData {
    Native.mandelbrot(Buffer.from(image.data.buffer), width, height, pixel_size, x0, y0);
    return image;
  }

  getType(): BackendType {
    return BackendType.Native;
  }

  dispose() {}
}

const _mandelbrot =
  AsmJs.cwrap('mandelbrot',
            undefined,
            ['number', 'number', 'number', 'number', 'number', 'number', 'number']);

// Asm.js backend built by Emscripten toolchain.
class AsmJsBackend implements IDisposable {
  buffer: Uint8ClampedArray;

  constructor(n_bytes: number) {
    // Create a heap to interact with Emscripten's function
    let ptr = AsmJs._malloc(n_bytes);
    this.buffer = new Uint8ClampedArray(AsmJs.HEAPU8.buffer, ptr, n_bytes);
  }

  call(image: ImageData, width: number, height: number, pixel_size: number, x0: number, y0: number): ImageData {
    if (this.buffer === null) {
      return;
    }
    _mandelbrot(this.buffer.byteOffset, this.buffer.length, width, height, pixel_size, x0, y0);
    image.data.set(this.buffer);

    return image;
  }

  getType(): BackendType {
    return BackendType.AsmJs;
  }

  dispose() {
    if (this.buffer !== null) {
      // Free memory.
      AsmJs._free(this.buffer.byteOffset);
      this.buffer = null;
    }
  }
}

enum BackendType {
  Native, // use native module
  AsmJs,  // use Asm.js
}

class MandelbrotRenderer {
  canvas: HTMLCanvasElement;
  backend: NativeBackend | AsmJsBackend;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.backend = new NativeBackend();
  }

  switchBackend(backendType: BackendType) {
    if (backendType === this.backend.getType()) {
      return;
    }

    this.backend.dispose();
    switch (backendType) {
      case BackendType.Native:
        console.log("[debug] switch to Native.Backend");
        this.backend = new NativeBackend();
        break;
      case BackendType.AsmJs:
        console.log("[debug] switch to AsmJs.Backend");
        this.backend = new AsmJsBackend(this.canvas.width * this.canvas.height * 4);
        break;
    }
  }

  apply(pixel_size: number, x0: number, y0: number) {
    let context = this.canvas.getContext('2d');
    let image = this.backend.call(context.getImageData(0, 0, this.canvas.width, this.canvas.height),
                                  this.canvas.width, this.canvas.height, pixel_size, x0, y0);
    context.putImageData(image, 0, 0);
  }
}

class App {
  renderer: MandelbrotRenderer;

  constructor() {
    let renderBtn = <HTMLButtonElement> document.getElementById('render');
    renderBtn.onclick = () => this.render();

    let canvas = <HTMLCanvasElement> document.getElementById('screen');
    this.renderer = new MandelbrotRenderer(canvas);

    let backend = <HTMLSelectElement> document.getElementById('backend');
    backend.addEventListener("change", () => {
      if (backend.value === "native") {
        this.renderer.switchBackend(BackendType.Native);
      } else if (backend.value === "asmjs") {
        this.renderer.switchBackend(BackendType.AsmJs);
      }
    });
  }

  render() {
    let pixel_size = +((<HTMLInputElement> document.getElementById('pixel_size')).value);
    let x0 = +((<HTMLInputElement> document.getElementById('x0')).value);
    let y0 = +((<HTMLInputElement> document.getElementById('y0')).value);
    this.renderer.apply(pixel_size, x0, y0);
  }
}

var app: App = null;
window.onload = () => {
  app = new App();
};
