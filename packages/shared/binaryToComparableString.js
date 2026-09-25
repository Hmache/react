/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Turns a TypedArray or ArrayBuffer into a string that can be used for comparison
// in a Map to see if the bytes are the same.
export default function binaryToComparableString(
  view: $ArrayBufferView,
): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  // Passing every byte as an argument to fromCharCode overflows the call stack
  // for large buffers, so we convert in chunks.
  const CHUNK_SIZE = 8192;
  if (bytes.length <= CHUNK_SIZE) {
    return String.fromCharCode.apply(String, bytes);
  }
  let result = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    result += String.fromCharCode.apply(
      String,
      bytes.subarray(i, i + CHUNK_SIZE),
    );
  }
  return result;
}
