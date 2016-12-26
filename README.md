# neon-electron

awesome Neon app

## Instruction

create a new neon application:

```shell-session
$ npm install -g neon-cli  # install neon tool
$ neon new neon-electron   # create project
$ cd neon-electron/
```

install dependencies

```shell-session
$ npm install --save-dev \
...  electron-prebuilt@1.2.1 \
...  electron-rebuild@1.2.1
```

edit package.json

```shell-session
$ edit package.json
```

```json
{
  ...

  "main": "main.js",

  ...

  "scripts": {
    "native": "./node_modules/.bin/neon build && ./node_modules/.bin/electron-rebuild native/index.node",
    "electron": "./node_modules/.bin/electron ."
  },

  ...
}
```

write electron application

```javascript
// main.js
const electron = require('electron');
const app = electron.app;
var BrowserWindow = electron.BrowserWindow;


app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width:800, height:600 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
```

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <input type="button" value="Run" onclick="run()" />
    <br />
    <div id="output"></div>
    <script type="text/javascript">
    var hello = require('./native');

    function run() {
      var target = document.getElementById("output");
      var message = hello.hello();
      target.innerHTML = message;
    }
    </script>
  </body>
</html>
```

Build & Run

```shell-session
$ npm run native
$ npm run electron
```

