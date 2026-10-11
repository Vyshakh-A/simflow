//index.ts

//imports
import { Client } from "./Classes/Client.js";
import { Server } from "./Classes/Server.js";
import { Network } from "./Classes/Network.js";
import { Simulator } from "./Simulator.js";
import type { Message } from "./Types/Message.js";

// error handlers
import { ConfigurationError } from "./Errors/ConfigurationError.js";
import { Workload } from "./Classes/Workload.js";

const simulator = new Simulator();
let server: Server;

try {
    server = new Server(simulator, { processingTime: 20, workerCount: 5 });
} catch (error) {
    if (error instanceof ConfigurationError) {
        console.log("Configuration problem:", error.message);
    }
    throw error;
}
const network = new Network(simulator, server, { latency: 30 });

const client = new Client(simulator, network);

network.setClient(client)

const requests: Message[] = [
    { from: "Client", to: "Server", method: "GET", route: "/users", data: "userId=101", },
    { from: "Client", to: "Server", method: "GET", route: "/products", data: "category=electronics", },
    { from: "Client", to: "Server", method: "GET", route: "/orders", data: "userId=101", },
    { from: "Client", to: "Server", method: "POST", route: "/users", data: "name=Vyshakh, email=vyshakh@example.com", },
    { from: "Client", to: "Server", method: "POST", route: "/unknown", data: "name=Vyshakh, email=vyshakh@example.com", },
    { from: "Client", to: "Server", method: "POST", route: "/users", data: "", },
    { from: "Client", to: "Server", method: "DELETE", route: "/unknown", data: "resourceId=999", }
];
const workload = new Workload(simulator, client, requests, {interval: 20});

workload.generate();

simulator.run();


