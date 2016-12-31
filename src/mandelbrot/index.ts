import {Native, Wasm} from 'mandelbrot';

class App {
  render() {
    let backend = (<HTMLSelectElement> document.getElementById('backend')).value;
    let pixel_size = +(<HTMLInputElement> document.getElementById('pixel_size')).value;
    let x0 = +(<HTMLInputElement> document.getElementById('x0')).value;
    let y0 = +(<HTMLInputElement> document.getElementById('y0')).value;

    var canvas = <HTMLCanvasElement> document.getElementById('screen');

    switch (backend) {
      case "native":
        Native.mandelbrot(canvas, pixel_size, x0, y0);
        break;
      case "asmjs":
        Wasm.mandelbrot(canvas, pixel_size, x0, y0);
        break;
    }
  }
}

var app: App = null;

window.onload = () => {
  app = new App();

  var renderBtn = <HTMLButtonElement> document.getElementById('render');
  renderBtn.onclick = () => {
    app.render();
  };
};
