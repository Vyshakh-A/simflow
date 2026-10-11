//Network.test.ts

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Network } from '../Classes/Network.js';
import { Server } from '../Classes/Server.js';
import { Client } from '../Classes/Client.js';
import { Simulator } from '../Simulator.js';

test("Send Request: Request delivered after 30 ms", () => {

    const simulator = new Simulator();
    const server = new Server(simulator, {
        processingTime: 20,
        workerCount: 1,
    });

    let actualValue: number | undefined;

    server.receive = () => {
        actualValue = simulator.getTime();
    };

    const network = new Network(simulator, server, { latency: 30 });

    network.sendRequest({
        id: "Client-1",
        message: {
            from: "Client",
            to: "Server",
            method: "GET",
            route: "/users",
            data: "",
        },
    });

    simulator.run();

    assert.equal(actualValue, 30);
});

test("Send response: Response delivered after another 30 ms", () => {
    const simulator = new Simulator();
    const server = new Server(simulator, {
        processingTime: 20,
        workerCount: 1,
    });
    const network = new Network(simulator, server, { latency: 30 });
    const client = new Client(simulator, network);
    let actualValue: number | undefined;

    client.receive = () => {
        actualValue = simulator.getTime();
    };
    network.setClient(client);
    server.receive = (message, requestNetwork) => {
        server.send(message, requestNetwork);
    };

    network.sendRequest({
        id: "Client-1",
        message: {
            from: "Client",
            to: "Server",
            method: "GET",
            route: "/users",
            data: "",
        },
    });
    simulator.run();

    assert.equal(actualValue, 60);
});