import type { Message } from "./Message.js";

export interface Receiver {
    receive(message: Message): void;
}