/**
 * @license
 * Copyright (c) 2025 Raphyah
 * Licensed under the MIT License. See LICENSE file in the project root for details.
 */
import { ContainerSlot, Entity, ItemStack, World } from "@minecraft/server";
type DynamicPropertyTarget = ContainerSlot | Entity | ItemStack | World;
/**
 * @remarks
 * It works similarly to {@link @minecraft/server.Entity#setDynamicProperty}, but instead of primitives or {@link @minecraft/server.Vector3} it expects an {@link ArrayLike} of 64-bit IEEE-754 double-precision floating-point numbers, an {@link ArrayBuffer}, an {@link ArrayBufferView}, or `undefined`.
 *
 * @param identifier The property identifier.
 * @param buffer The data to be saved. Its byte length can't exceed 20476 bytes.
 * @throws {@link TypeError} - Throws if the identifier is not of type string. Throws if buffer is not {@link ArrayLike}, {@link ArrayBuffer}, {@link ArrayBufferView} or `undefined`.
 * @throws {@link RangeError} - Throws if the provided buffer length exceeds 20476 bytes.
 */
type SetDynamicBufferFn = (this: DynamicPropertyTarget, identifier: string, buffer?: ArrayLike<number> | ArrayBuffer | ArrayBufferView) => void;
/**
 * @remarks
 * It works similarly to {@link @minecraft/server.Entity#getDynamicProperty}, but it returns an {@link ArrayBuffer} or `undefined` instead of the same type passed to it.
 *
 * @param identifier The property identifier.
 * @returns Returns the dynamic property data converted back to an {@link ArrayBuffer}. `undefined` if the stored data is not of type string.
 * @throws {@link TypeError} - Throws if the identifier is not of type string.
 */
type GetDynamicBufferFn = (this: DynamicPropertyTarget, identifier: string) => ArrayBuffer | undefined;
interface DynamicBufferComponent {
    setDynamicBuffer: SetDynamicBufferFn;
    getDynamicBuffer: GetDynamicBufferFn;
}
declare module "@minecraft/server" {
    interface ContainerSlot extends DynamicBufferComponent {
    }
    interface Entity extends DynamicBufferComponent {
    }
    interface ItemStack extends DynamicBufferComponent {
    }
    interface World extends DynamicBufferComponent {
    }
}
export {};
