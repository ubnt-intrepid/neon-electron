# neon-electron
A simple example of GUI application with Electron and Rust,
by using [neon-bindings/neon](https://github.com/neon-bindings/neon).

## Assumption
* Node.js v6.9.2
* Linux (or macOS)
  - Fedora 25 (with amd64)
  - Windows has not supported yet

## Usage

clone & install dependencies

```shell-session
$ git clone https://github.com/ubnt-intrepid/neon-electron.git
$ cd neon-electron/
$ npm install
```

build native module & run as an electron application.

```shell-session
$ npm run native
$ npm run electron
```

## License
MIT License (See [LICENSE](LICENSE) for details)
