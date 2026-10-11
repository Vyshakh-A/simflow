//server.test.ts

import { test } from 'node:test'
import { Server } from '../Classes/Server.js'
import { Simulator } from '../Simulator.js'
import { Network } from '../Classes/Network.js';
import assert from 'node:assert/strict';
import type { Message } from '../Types/Message.js';
import type { MessageEnvelope } from '../Types/Message.js';
import type { Client } from '../Classes/Client.js';

function createServer(simulator: Simulator) {
    return new Server(simulator, {
        processingTime: 20,
        workerCount: 1,
    });
}

function createEnvelope(message: Message, id = "Client-1"): MessageEnvelope {
    return { id, message };
}

test("POST /users with empty body returns 400", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/users",
        data: ""
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 400,
        data: "Request data is required"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /users with a valid body returns 201", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/users",
        data: "name=Alex, email=alex@example.com"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 201,
        data: "User created"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("GET /users returns 200", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "GET",
        route: "/users",
        data: "userId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 200,
        data: "User returned"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("GET /products returns 200", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "GET",
        route: "/products",
        data: "productId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/products",
        statusCode: 200,
        data: "Products returned"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("GET /orders returns 200", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "GET",
        route: "/orders",
        data: "orderId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/orders",
        statusCode: 200,
        data: "Orders returned"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("GET /unknown returns 404", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "GET",
        route: "/unknown",
        data: "orderId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/unknown",
        statusCode: 404,
        data: "Not Found"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("PATCH /users returns 404", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "PATCH",
        route: "/users",
        data: "userId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 404,
        data: "Not Found"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("DELETE /users returns 404", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "DELETE",
        route: "/users",
        data: "userId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 404,
        data: "Not Found"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /users returns 400", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/users",
        data: " "
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 400,
        data: "Request data is required"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /users returns 400", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/users",
        data: "\t\n"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 400,
        data: "Request data is required"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /users returns 201", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/users",
        data: " name=Alex "
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/users",
        statusCode: 201,
        data: "User created"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /products returns 404", () => {

    let actualResponse: Message | undefined;

    const simulator = new Simulator();
    const server = createServer(simulator);

    const fakeNetwork = {
        sendResponse(response: MessageEnvelope) {
            actualResponse = response.message;
        }
    } as unknown as Network;

    const testCase: Message = {
        from: "Client",
        to: "Server",
        method: "POST",
        route: "/products",
        data: "productId=101"
    };

    const expectedOutcome: Message = {
        from: "Server",
        to: "Client",
        method: "RESPONSE",
        route: "/products",
        statusCode: 404,
        data: "Not Found"
    };

    server.send(createEnvelope(testCase), fakeNetwork);

    assert.deepStrictEqual(actualResponse, expectedOutcome);

})

test("POST /users Requests processed FIFO", () => {
    const simulator = new Simulator();
    const server = createServer(simulator);
    const network = new Network(simulator, server, { latency: 30 });

    const fakeClient = {
        receive() { }
    } as unknown as Client;

    network.setClient(fakeClient);

    const processedRequests: string[] = [];

    const originalSend = server.send.bind(server);

    server.send = (envelope, requestNetwork) => {
        processedRequests.push(envelope.message.data);
        originalSend(envelope, requestNetwork);
    };

    const testCases: Message[] = [
        {
            from: "Client",
            to: "Server",
            method: "POST",
            route: "/users",
            data: "User 1",
        },
        {
            from: "Client",
            to: "Server",
            method: "POST",
            route: "/users",
            data: "User 2",
        },
        {
            from: "Client",
            to: "Server",
            method: "POST",
            route: "/users",
            data: "User 3",
        },
        {
            from: "Client",
            to: "Server",
            method: "POST",
            route: "/users",
            data: "User 4",
        },
    ];

    testCases.forEach((message, index) => {
        server.receive(createEnvelope(message, `Client-${index + 1}`), network);
    });

    simulator.run();

    assert.deepStrictEqual(processedRequests, [
        "User 1",
        "User 2",
        "User 3",
        "User 4",
    ]);
});
