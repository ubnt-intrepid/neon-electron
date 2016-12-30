import {Native, Wasm} from 'mandelbrot';

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
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    var imageData = context.createImageData(width, height);
    Wasm.mandelbrot(imageData, this.pixel_size, this.x0, this.y0);

    context.putImageData(imageData, 0, 0);
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
