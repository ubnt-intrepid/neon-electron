import {BackendType, MandelbrotRenderer} from 'mandelbrot';

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
  settings: Settings;
  renderBtn: HTMLButtonElement;
  renderer: MandelbrotRenderer;

  constructor() {
    this.settings = new Settings();
    this.renderBtn = <HTMLButtonElement> document.getElementById('render');
    this.renderBtn.onclick = () => this.render();

    let canvas = <HTMLCanvasElement> document.getElementById('screen');
    this.renderer = new MandelbrotRenderer(canvas);
  }

  render() {
    let settings = this.settings.getValue();
    this.renderer.switchBackend(settings[0]);
    this.renderer.apply(settings[1], settings[2], settings[3]);
  }
}

var app: App = null;
window.onload = () => { app = new App(); };
