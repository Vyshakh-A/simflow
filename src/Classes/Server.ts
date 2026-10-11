// Classes/Server.ts

import type { Simulator } from "../Simulator.js";
import type { Network } from "./Network.js";
import type { Message, MessageEnvelope } from "../Types/Message.js";
import { ConfigurationError } from "../Errors/ConfigurationError.js";

type RequestHandle = {
    statusCode: number;
    responseData: string;
}

type ServerConfig = {
    processingTime: number;
    workerCount: number;
}

type Worker = {
    busy: boolean;
}

export class Server {

    private simulator: Simulator;
    private queue: { envelope: MessageEnvelope, network: Network }[] = [];
    private processingTime: number;
    private workers: Worker[] = []


    constructor(simulator: Simulator, config: ServerConfig) {

        if(config.workerCount <= 0) {
            throw new ConfigurationError("workerCount must be greater than 0");
        }
        
        if(config.processingTime < 0) {
            throw new ConfigurationError("processing time cant be negative");
        }


        this.simulator = simulator;
        this.processingTime = config.processingTime

        for(let i = 0; i < config.workerCount; i++) {
            this.workers.push({busy: false});
        }
    }

    private handleRequest(message: Message): RequestHandle {
        let statusCode: number;
        let responseData: string;

        if (message.method === "GET") {
            if (message.route === "/users") {
                statusCode = 200;
                responseData = "User returned";
            } else if (message.route === "/products") {
                statusCode = 200;
                responseData = "Products returned";
            } else if (message.route === "/orders") {
                statusCode = 200;
                responseData = "Orders returned";
            } else {
                statusCode = 404;
                responseData = "Not Found";
            }
        }

        else if (message.method === "POST") {
            if (message.route === "/users") {

                if (!message.data.trim()) {
                    statusCode = 400;
                    responseData = "Request data is required";
                } else {
                    statusCode = 201;
                    responseData = "User created";
                }
            } else {

                statusCode = 404;
                responseData = "Not Found";
            }
        }

        else {
            statusCode = 404;
            responseData = "Not Found";
        }

        return {
            statusCode: statusCode,
            responseData: responseData
        }
    }

    receive(envelope: MessageEnvelope, network: Network) {
        this.queue.push({ envelope, network });
        this.processNext()
    }


    send(envelope: MessageEnvelope, network: Network) {

        const message = envelope.message;
        const result: RequestHandle = this.handleRequest(message);
        

        const response: Message = {
            from: "Server",
            to: message.from,
            method: "RESPONSE",
            route: message.route,
            statusCode: result.statusCode,
            data: result.responseData,
        };

        const responseEnvelope: MessageEnvelope = {
            id:envelope.id,
            message: response
        }

        network.sendResponse(responseEnvelope);
    }

    processNext() {
        if (this.queue.length === 0) {
            return;
        }

        const worker = this.workers.find(worker => !worker.busy);

        if (!worker) {
            return;
        }

        worker.busy = true;

        const request = this.queue.shift()!;

        this.simulator.scheduleIn(this.processingTime, {
            name: "processing",
            action: () => {
                console.log(`Server processing: ${request.envelope.message.data}`);
                this.send(request.envelope, request.network);

                worker.busy = false;

                this.processNext();
            }
        })
    }
}