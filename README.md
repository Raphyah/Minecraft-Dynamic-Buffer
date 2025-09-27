# Minecraft Dynamic Buffer

A workaround to save binary content to dynamic properties.

## Why Dynamic Buffers?

I've been using Node.JS buffers a lot, and the idea of savings raw binary data is really incredible. It allows a lot of data to be saved directly as bytes inside files, reducing the overall size of it.  
JSON is okay, but it's too verbose. It adds brackets, curly brackets, comas, colons, double quotes, and even spaces, tab spaces and newline characters if indentation is defined. Binary data, on the other hand, is just a straight line of bytes.  
In the past few days I've been thinking about how to make buffers actually work in Minecraft with a pure JavaScript implementation, and this is the result.

## Usage

To start, either download the `"lib/dynamicBuffer.js"` file or download and transpile the `"src/dynamicBuffer.ts"` file, move it to your behavior pack's script directory, and import it in your main file. There is no need to import it in every single file, the module modifies `"@minecraft/server"` directly, but you might want to import it before any file that tries to use dynamic buffers.

These methods are available for instances of `ContainerSlot`, `Entity`, `ItemStack` and `World`:

### setDynamicBuffer

`setDynamicBuffer(identifier: string, buffer?: number[] | ArrayBuffer | ArrayBufferView): void`

It works similarly to [`setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity#setdynamicproperty), but instead of primitives or [`Vector3`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/vector3) it expects an [`ArrayLike`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of 64-bit IEEE-754 double-precision floating-point numbers, an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), an `ArrayBufferView`, or `undefined`.

#### Parameters

- **identifier**: _string_
  - The property identifier.
- **buffer**?: _number[]_, _ArrayBuffer_, _ArrayBufferView_
  - The data to be saved. Its byte length can't exceed 20476 bytes.

### getDynamicBuffer

`getDynamicBuffer(identifier: string): ArrayBuffer | undefined`

It works similarly to [`getDynamicProperty(identifier: string): boolean | number | string | Vector3`](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity#getdynamicproperty), but it returns an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or `undefined` instead of the same type passed to it.

#### Parameters

- **identifier**: _string_
  - The property identifier.

**Returns** _ArrayBuffer_ - Returns the dynamic property data converted back to an `ArrayBuffer`. `undefined` if the stored data is not of type string.

## Example

```js
import { world } from '@minecraft/server';
import 'dynamicBuffer.js';

world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
  const data = new DataView(
    source.getDynamicBuffer('property_x') || new ArrayBuffer(256),
  );
  if (itemStack.typeId === 'minecraft:stick') {
    data.setUint8(23, data.getUint8(23) ? 0 : 1);
  }
  source.setDynamicBuffer('property_x', data);
});
```
