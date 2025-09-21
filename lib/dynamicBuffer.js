import { ContainerSlot, Entity, ItemStack, World } from "@minecraft/server";
const setDynamicBuffer = function (identifier, buffer) {
    if (typeof identifier !== "string") {
        throw new TypeError("Native type conversion failed. Function argument [0] expected type: string");
    }
    if (!identifier) {
        throw new TypeError("Native type conversion failed. Function argument [0] must not be an empty string");
    }
    if (buffer === null || buffer === void 0)
        return this.setDynamicProperty(identifier, buffer);
    if (!Array.isArray(buffer) &&
        !(buffer instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(buffer)) {
        throw new TypeError("Native variant type conversion failed. Function argument [1] expected type: number[] | ArrayBuffer | ArrayBufferView | undefined");
    }
    const temp = new Uint8Array(buffer.buffer || buffer);
    const dataLength = temp.length;
    if (dataLength > 4294967295) {
    }
    const totalLength = dataLength + 4;
    const res = new Uint16Array(Math.ceil((totalLength / 7) * 8));
    let acc = 0;
    let accBits = 0;
    let bytePos = 0;
    for (let i = 0; i < 4; i++) {
        const byte = (dataLength >> (i * 8)) & 255;
        acc = (acc << 8) | byte;
        accBits += 8;
        while (accBits >= 15) {
            accBits -= 15;
            res[bytePos++] = ((acc >> accBits) & 32767) | 32768;
        }
    }
    for (let i = 0; i < dataLength; i++) {
        const byte = temp[i];
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
    this.setDynamicProperty(identifier, String.fromCharCode.apply(null, res));
};
const getDynamicBuffer = function (identifier) {
    if (typeof identifier !== "string") {
        throw new TypeError("Native type conversion failed. Function argument [0] expected type: string");
    }
    if (!identifier) {
        throw new TypeError("Native type conversion failed. Function argument [0] must not be an empty string");
    }
    const str = this.getDynamicProperty(identifier);
    if (typeof str !== "string") {
        return undefined;
    }
    let bufLen = 0;
    let acc = 0;
    let accBits = 0;
    let bytePos = 0;
    for (let i = 0; i < 3; i++) {
        const code = str.charCodeAt(i) ^ 32768;
        acc = (acc << 15) | code;
        accBits += 15;
        while (accBits >= 8) {
            if (bytePos >= 4)
                break;
            accBits -= 8;
            bufLen |= ((acc >> accBits) & 255) << (bytePos * 8);
            bytePos++;
        }
    }
    bufLen >>>= 0;
    bytePos = 0;
    const res = new ArrayBuffer(bufLen);
    const buf = new Uint8Array(res);
    const strLen = str.length;
    for (let i = 3; i < strLen; i++) {
        const code = str.charCodeAt(i) ^ 32768;
        acc = (acc << 15) | code;
        accBits += 15;
        while (accBits >= 8) {
            if (bytePos >= res.byteLength)
                break;
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
