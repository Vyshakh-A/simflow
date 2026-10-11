// classes/client.ts
import type { Simulator } from "../Simulator.js";
import type { Message, MessageEnvelope } from "../Types/Message.js";
import type { Network } from "./Network.js";

export class Client {

    private network: Network;
    private simulator: Simulator;
    private startTimes = new Map<string, number>();
    private responseTimes = new Map<string, number>();

    constructor(simulator: Simulator, network: Network) {
        this.simulator = simulator;
        this.network = network;
    }

    send(message: Message) {
        const id = this.simulator.createRequestId(message.from);
        const envelope: MessageEnvelope = {
            id: id,
            message: message
        }

        this.startTimes.set(
            envelope.id,
            this.simulator.getTime()
        )

        this.network.sendRequest(envelope);
    }

    receive(envelope: MessageEnvelope) {
        const id = envelope.id;
        const message = envelope.message;

        const responseTime = this.simulator.getTime() - this.startTimes.get(id)!;

        this.responseTimes.set(id, responseTime);
        this.startTimes.delete(id);

        console.log(`Response time: ${responseTime}`)
        console.log(`Status code: ${message.statusCode}`)
        console.log(`Client received: ${message.data}`);
    }

    getResponseTime(id: string): number | undefined {
        return this.responseTimes.get(id);
    }

    hasStartTime(id: string): boolean {
        return this.startTimes.has(id);
    }
}