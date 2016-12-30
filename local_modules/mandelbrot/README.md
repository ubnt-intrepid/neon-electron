# mandelbrot

A simple example for creating module of JavaScript, written in Rust.

## TL;DR

```shell-session
$ npm install
```

## Detailed instruction for building

### Node's native module (located at `./native/index.node`):

```shell-session
$ ./node_modules/.bin/neon build
```

### asm.js (located at `./wasm/index.js`):

```shell-session
$ ./wasm/build.sh
```

or

```shell-session
$ cd wasm/
$ cargo +nightly build --release
```

### Wrapper script (`./index.js`)

```shell-session
$ tsc --pretty -p .
```
