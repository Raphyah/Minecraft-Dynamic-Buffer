// Copyright (c) 2025 Raphyah
// Licensed under the MIT License. See LICENSE file in the project root for details.

import { ContainerSlot, Entity, ItemStack, World } from "@minecraft/server";

type DynamicPropertyTarget = ContainerSlot | Entity | ItemStack | World;

type SetDynamicBufferFn = (
  this: DynamicPropertyTarget,
  identifier: string,
  buffer?: number[] | ArrayBuffer | ArrayBufferView,
) => void;

type GetDynamicBufferFn = (
  this: DynamicPropertyTarget,
  identifier: string,
) => ArrayBuffer | undefined;

interface DynamicBufferComponent {
  setDynamicBuffer: SetDynamicBufferFn;
  getDynamicBuffer: GetDynamicBufferFn;
}

/**
 * @remarks
 * It works similarly to {@link module:@minecraft/server.Entity#setDynamicProperty}, but instead of primitives or `Vector3` it expects an array of 8-bit integers, an `ArrayBuffer`, or a view (`TypedArray` or `DataView`).
 *
 * @param identifier The property identifier.
 * @param buffer The data to be saved. Its byte length can't be greater than 20476.
 * @throws {@link TypeError} - Throws if the identifier is not of type string or if it's empty. Throws if buffer is not an `array`, {@link ArrayBuffer}, {@link ArrayBufferView} or `undefined`.
 * @throws {@link RangeError} - Throws if the provided buffer length is 0 or greater than 20476.
 */
const setDynamicBuffer: SetDynamicBufferFn = function (identifier, buffer) {
  if (typeof identifier !== "string") {
    throw new TypeError("Invalid identifier: expected a string");
  }

  if (!identifier) {
    throw new TypeError("Invalid identifier: string can not be empty");
  }

  if (buffer === null || buffer === void 0)
    return this.setDynamicProperty(identifier, buffer);

  if (
    !Array.isArray(buffer) &&
    !(buffer instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(buffer)
  ) {
    throw new TypeError(
      "Invalid buffer: expected one of number[] | ArrayBuffer | ArrayBufferView | undefined",
    );
  }

  const buf = new Uint8Array((buffer as ArrayBufferView).buffer || buffer);
  const bufLen = buf.byteLength;

  if (bufLen === 0 || bufLen > 20476) {
    throw new RangeError(
      "Invalid buffer: length can not be lesser than 1 or greater than 20476 bytes",
    );
  }

  const res = new Uint16Array(Math.ceil((bufLen / 15) * 8) + 1);

  let acc = 0;
  let accBits = 0;

  let bytePos = 0;

  res[bytePos++] = bufLen;

  // Data bytes
  for (let i = 0; i < bufLen; i++) {
    const byte = buf[i];
    acc = (acc << 8) | byte;
    accBits += 8;

    while (accBits >= 15) {
      accBits -= 15;
      res[bytePos++] = ((acc >> accBits) & 32767) | 32768;
    }
  }

  if (accBits > 0) {
    res[bytePos] = ((acc << (15 - accBits)) & 32767) | 32768;
  }

  this.setDynamicProperty(
    identifier,
    String.fromCharCode.apply(null, res as unknown as number[]),
  );
};

/**
 * @remarks
 * It works similarly to {@link module:@minecraft/server.Entity#getDynamicProperty}, but it returns an `ArrayBuffer` instead of the same type passed to it, except for invalid data.
 *
 * @param identifier The property identifier.
 * @returns Returns the dynamic property data converted back to the array of bytes. `undefined` if the stored data is not of type string.
 * @throws {@link TypeError} - Throws if the identifier is not of type string or if it's empty.
 */
const getDynamicBuffer: GetDynamicBufferFn = function (identifier) {
  if (typeof identifier !== "string") {
    throw new TypeError("Invalid identifier: expected a string");
  }

  if (!identifier) {
    throw new TypeError("Invalid identifier: string can not be empty");
  }

  const str = this.getDynamicProperty(identifier);

  if (typeof str !== "string") {
    return undefined;
  }

  const bufLen = str.charCodeAt(0);
  const strLen = str.length;

  const res = new ArrayBuffer(bufLen);
  const buf = new Uint8Array(res);

  let acc = 0;
  let accBits = 0;

  let bytePos = 0;

  // Data bytes
  for (let i = 1; i < strLen; i++) {
    const code = str.charCodeAt(i) ^ 32768;
    acc = (acc << 15) | code;
    accBits += 15;

    while (accBits >= 8) {
      if (bytePos >= res.byteLength) break;
      accBits -= 8;
      buf[bytePos++] = (acc >> accBits) & 255;
    }
  }

  if (accBits > 0 && bytePos < bufLen) {
    buf[bytePos] = (acc << (8 - accBits)) & 255;
  }

  return res;
};

if (!("setDynamicBuffer" in ContainerSlot.prototype)) {
  Object.defineProperty(ContainerSlot.prototype, "setDynamicBuffer", {
    value: setDynamicBuffer,
  });
}
if (!("getDynamicBuffer" in ContainerSlot.prototype)) {
  Object.defineProperty(ContainerSlot.prototype, "getDynamicBuffer", {
    value: getDynamicBuffer,
  });
}
if (!("setDynamicBuffer" in Entity.prototype)) {
  Object.defineProperty(Entity.prototype, "setDynamicBuffer", {
    value: setDynamicBuffer,
  });
}
if (!("getDynamicBuffer" in Entity.prototype)) {
  Object.defineProperty(Entity.prototype, "getDynamicBuffer", {
    value: getDynamicBuffer,
  });
}
if (!("setDynamicBuffer" in ItemStack.prototype)) {
  Object.defineProperty(ItemStack.prototype, "setDynamicBuffer", {
    value: setDynamicBuffer,
  });
}
if (!("getDynamicBuffer" in ItemStack.prototype)) {
  Object.defineProperty(ItemStack.prototype, "getDynamicBuffer", {
    value: getDynamicBuffer,
  });
}
if (!("setDynamicBuffer" in World.prototype)) {
  Object.defineProperty(World.prototype, "setDynamicBuffer", {
    value: setDynamicBuffer,
  });
}
if (!("getDynamicBuffer" in World.prototype)) {
  Object.defineProperty(World.prototype, "getDynamicBuffer", {
    value: getDynamicBuffer,
  });
}

declare module "@minecraft/server" {
  interface ContainerSlot extends DynamicBufferComponent {}
  interface Entity extends DynamicBufferComponent {}
  interface ItemStack extends DynamicBufferComponent {}
  interface World extends DynamicBufferComponent {}
}
