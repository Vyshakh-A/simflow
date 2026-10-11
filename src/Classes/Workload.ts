// workload.ts

import { Client } from "./Client.js";
import type { Message } from "../Types/Message.js";
import type { Simulator } from "../Simulator.js";
import { ConfigurationError } from "../Errors/ConfigurationError.js";

type WorkloadConfig = {
    interval: number;
}

export class Workload {
    private simulator: Simulator;
    private client: Client;
    private requests: Message[];
    private interval: number;

    constructor(simulator: Simulator, client: Client, requests: Message[], config: WorkloadConfig) {

        if(config.interval < 0) {
            throw new ConfigurationError("Interval must not be negative")
        }

        this.simulator = simulator;
        this.client = client;
        this.requests = requests;
        this.interval = config.interval;
    }

    generate() {
        let delay = 0;
        for(const request of this.requests) {
            this.simulator.scheduleIn(delay, {
                name: "REQUEST",
                action: () => this.client.send(request)
            })
            delay += this.interval;
        }
    }


}