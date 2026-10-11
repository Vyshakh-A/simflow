import { test } from "node:test";
import { Simulator } from "../Simulator.js";
import { Server } from "../Classes/Server.js";
import { Network } from "../Classes/Network.js";
import { Client } from "../Classes/Client.js";
import type { Message } from "../Types/Message.js";
import { strict as assert } from 'node:assert';
import { Workload } from "../Classes/Workload.js";

test("the metric measures the entire request → response lifecycle", () => {
    const simulator = new Simulator();

    const server = new Server(simulator, {
        processingTime: 20,
        workerCount: 1
    });

    const network = new Network(simulator, server, {
        latency: 30
    });

    const client = new Client(simulator, network);

    network.setClient(client);

    const request: Message = {
        from: "Client",
        to: "Server",
        method: "GET",
        route: "/users",
        data: "userId=101",
    };

    client.send(request);

    simulator.run();

    const actualResponse = client.getResponseTime("Client-1");

    assert.equal(actualResponse, 80);
});

test("calculates response time using each request's own ID and start time", () => {
    const simulator = new Simulator();

    const server = new Server(simulator, {
        processingTime: 30,
        workerCount: 1
    });

    const network = new Network(simulator, server, {
        latency: 30
    });

    const client = new Client(simulator, network);

    network.setClient(client);


    const requests: Message[] = [
        { from: "Client", to: "Server", method: "GET", route: "/users", data: "userId=101", },
        { from: "Client", to: "Server", method: "GET", route: "/products", data: "category=electronics", },
    ];
    const workload = new Workload(simulator, client, requests, { interval: 10 });

    workload.generate();

    simulator.run();

    const client1 = client.getResponseTime("Client-1");
    const client2 = client.getResponseTime("Client-2");

    assert.ok(client2! > (30 + 30 + 30));

    assert.equal(client1, 90);
    assert.equal(client2, 110);
})

test("removes a request's start time after receiving its response", () => {
    const simulator = new Simulator();

    const server = new Server(simulator, {
        processingTime: 30,
        workerCount: 1
    });

    const network = new Network(simulator, server, {
        latency: 30
    });

    const client = new Client(simulator, network);

    network.setClient(client);


    const requests: Message[] = [
        { from: "Client", to: "Server", method: "GET", route: "/users", data: "userId=101", },
        { from: "Client", to: "Server", method: "GET", route: "/products", data: "category=electronics", },
    ];
    const workload = new Workload(simulator, client, requests, { interval: 10 });

    workload.generate();

    simulator.run();

    const client1 = client.hasStartTime("Client-1");
    const client2 = client.hasStartTime("Client-2");

    assert.equal(client1, false)
    assert.equal(client2, false)
    
})