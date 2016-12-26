var mandelbrot = require('./native');

function run() {
  var context = document.getElementById('screen').getContext('2d');
  var imageData = context.createImageData(300, 200);
  var buffer = new Buffer(imageData.data.buffer);
  mandelbrot.mandelbrot(buffer, 300, 200, 0.01, -2.0, -1.0);
  context.putImageData(imageData, 0, 0);
}
