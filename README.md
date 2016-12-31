# neon-electron
A simple example of GUI application with Electron and Rust,
by using [neon-bindings/neon](https://github.com/neon-bindings/neon).

## Requirements
* Node.js v6.9.2
* Linux (or macOS)
  - Fedora 25 (with amd64)
  - Windows has not supported yet
* Rust toolchain (with nightly channel).

## Usage

Enable emscripten:

```shell-session
$ source /path/to/emsdk/emsdk_env.sh
```

switch Node's version

```shell-session
$ nvm use
```

install dependencies & build native module

```shell-session
$ npm install
```

run as an electron application.

```shell-session
$ npm start
```

## License
MIT License (See [LICENSE](LICENSE) for details)
