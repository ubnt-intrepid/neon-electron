import {Native, AsmJs} from 'mandelbrot';

enum BackendType {
  Native, // use native module
  AsmJs,  // use Asm.js
}

type Backend = Native.Backend | AsmJs.Backend;


class Settings {
  backend: HTMLSelectElement;
  pixel_size: HTMLInputElement;
  x0: HTMLInputElement;
  y0: HTMLInputElement;

  constructor() {
    this.backend = <HTMLSelectElement> document.getElementById('backend');
    this.pixel_size = <HTMLInputElement> document.getElementById('pixel_size');
    this.x0 = <HTMLInputElement> document.getElementById('x0');
    this.y0 = <HTMLInputElement> document.getElementById('y0');
  }

  getValue(): [BackendType, number, number, number] {
    var backend;
    if (this.backend.value === "native") {
      backend = BackendType.Native;
    } else if (this.backend.value === "asmjs") {
      backend = BackendType.AsmJs;
    }

    let pixel_size = +this.pixel_size.value;
    let x0 = +this.x0.value;
    let y0 = +this.y0.value;

    return [backend, pixel_size, x0, y0];
  }
}

class App {
  renderBtn: HTMLButtonElement;
  canvas: HTMLCanvasElement;
  settings: Settings;

  constructor() {
    this.settings = new Settings();
    this.canvas = <HTMLCanvasElement> document.getElementById('screen');
    this.renderBtn = <HTMLButtonElement> document.getElementById('render');
    this.renderBtn.onclick = () => this.render();
  }

  render() {
    let settings = this.settings.getValue();
    let backend: Backend = (() => {
      switch (settings[0]) {
        case BackendType.Native:
          console.log("[debug] use Native.Backend");
          return new Native.Backend(this.canvas);
        case BackendType.AsmJs:
          console.log("[debug] use AsmJs.Backend");
          return new AsmJs.Backend(this.canvas);
      }
    })();
    backend.call(settings[1], settings[2], settings[3]);
  }
}

var app: App = null;
window.onload = () => { app = new App(); };
