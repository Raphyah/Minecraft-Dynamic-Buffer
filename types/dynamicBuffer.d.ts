import { ContainerSlot, Entity, ItemStack, World } from "@minecraft/server";
type DynamicPropertyTarget = ContainerSlot | Entity | ItemStack | World;
type SetDynamicBufferFn = (this: DynamicPropertyTarget, identifier: string, buffer?: number[] | ArrayBuffer | ArrayBufferView) => void;
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
