import {mandelbrot} from 'mandelbrot';

var pixel_size = 0.01;
var x0 = -2.0;
var y0 = -1.0;

function run() {
  var canvas = <HTMLCanvasElement> document.getElementById('screen');
  var context = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;

  var imageData = context.createImageData(width, height);
  mandelbrot(imageData, pixel_size, x0, y0);

  context.putImageData(imageData, 0, 0);
}
