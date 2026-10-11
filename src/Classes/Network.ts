//network.ts

import type { Simulator } from "../Simulator.js";
import type { Server } from "./Server.js";
import type { MessageEnvelope } from "../Types/Message.js";
import type { Client } from "./Client.js";

import { ConfigurationError } from "../Errors/ConfigurationError.js";


type NetworkConfig = {
    latency: number;
}

export class Network {
    private simulator: Simulator;
    private server: Server;
    private client!: Client;
    private latency: number;

    constructor(simulator: Simulator, server: Server, config: NetworkConfig) {

        if(config.latency < 0) {
            throw new ConfigurationError("latency cannot be negative")
        }

        this.simulator = simulator;
        this.server = server;
        this.latency = config.latency;
    }

    setClient(client: Client) {
        this.client = client;
    }

    sendRequest(envelope: MessageEnvelope) {
        this.simulator.scheduleIn(this.latency, {
            name: "Request",
            action: () => {
                console.log("Message send:", envelope.message.data);
                
                this.server.receive(envelope, this);
            }
        });
    }
    
    sendResponse(envelope: MessageEnvelope) {
        this.simulator.scheduleIn(this.latency, {
            name: "Response",
            action: () => {
                this.client.receive(envelope)
            }
        })
    }
}