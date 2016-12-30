#!/bin/bash
set -e

pushd $(dirname $BASH_SOURCE) > /dev/null
cargo +nightly build --release
cp target/asmjs-unknown-emscripten/release/wasm.js ./index.js
cat ./post.js >> ./index.js
popd > /dev/null
