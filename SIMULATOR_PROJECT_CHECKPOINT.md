# Discrete-Event Systems Simulator

A TypeScript learning project that models how requests move through a
client, network, server queue, server workers, and back to the client
using **virtual time**.

The goal is to understand system behavior and performance through small,
testable experiments---not to reproduce every detail of a real operating
system or network.

## Project goals

-   Learn TypeScript by building a working system rather than studying
    isolated examples.
-   Model request/response communication with a discrete-event
    simulator.
-   Understand network latency, server processing, queues, worker
    concurrency, and response time.
-   Keep experiments deterministic where possible so behavior can be
    tested and explained.
-   Add complexity incrementally, validating each feature before moving
    to the next.

## Core design

The simulator advances a virtual clock from one scheduled event to the
next. It does not wait in real time.

``` text
Workload
   |
   v
Client
   |
   v
Network -- request latency -->
   |
   v
Server FIFO Queue
   |
   v
Server Workers
   |
   v
Network -- response latency -->
   |
   v
Client
```

### Virtual-time rule

The project models elapsed time by scheduling events on the simulator's
clock. It must not use `setTimeout`, `setInterval`, `sleep`, or
`Date.now()` to simulate time.

## Current functionality

### 1. Discrete-event simulator

-   Maintains a virtual clock.
-   Stores scheduled events.
-   Processes events in scheduled-time order.
-   Updates the clock to each event's time as the event is executed.
-   Supports scheduling an event after a virtual-time delay.

### 2. Network

-   Has configurable network latency.
-   Schedules request and response delivery as future simulation events.
-   Carries request/response envelopes through the network.
-   Rejects negative latency through the project's configuration
    validation.

### 3. Server

-   Has configurable processing time and worker count.
-   Maintains a FIFO request queue.
-   Starts work when a worker is available.
-   Supports multiple workers processing requests concurrently in
    virtual time.
-   Handles a small set of example HTTP-like operations:
    -   `GET /users`
    -   `GET /products`
    -   `GET /orders`
    -   `POST /users`
-   Returns example status codes and response messages, including `400`
    for an empty user-creation payload and `404` for unsupported routes
    or methods.
-   Uses configuration validation for invalid worker counts and
    processing-time settings.

### 4. Workload generation

-   Accepts a list of requests.
-   Schedules requests using a configured fixed interval.
-   The first request is scheduled at delay `0`; subsequent requests are
    separated by the interval.
-   This currently models regular arrivals, not random or irregular
    traffic.

### 5. Request identity

A `Message` represents the message content. A `MessageEnvelope` wraps
that message with an ID:

``` ts
export type Message = {
    from: string;
    to: string;
    method: string;
    route: string;
    statusCode?: number;
    data: string;
};

export type MessageEnvelope = {
    id: string;
    message: Message;
};
```

The simulator owns request ID generation. The same ID is preserved
through the request and its corresponding response so the client can
match the response to the original request.

### 6. Basic response-time metric

The client records the virtual time when it sends a request, keyed by
request ID. When the matching response arrives, it calculates:

``` text
response time = response arrival time - request start time
```

This measures the full modeled request/response journey, including:

-   request network latency
-   server queue waiting
-   server processing
-   response network latency

After calculating the response time, the client removes that request's
start-time entry. The implementation also stores measured response times
for later inspection through its response-time accessor.

## Project structure

The source tree currently follows this structure:

``` text
src/
├── Classes/
│   ├── Client.ts
│   ├── Network.ts
│   ├── Server.ts
│   └── Workload.ts
├── Errors/
│   └── ConfigurationError.ts
├── Tests/
│   ├── Client.test.ts
│   ├── Network.test.ts
│   ├── Server.test.ts
│   └── simulator.test.ts
├── Types/
│   ├── Event.ts
│   └── Message.ts
├── Simulator.ts
└── index.ts
```

Check the repository before publishing and update this tree if filenames
have changed.

## Requirements and commands

The project has been developed with Node.js 20.x and TypeScript, using
ESM-style imports with `.js` extensions in TypeScript source.

Typical commands from the project root:

``` bash
npm install
npm test
npm run dev
npm run build
npm start
```

The configured scripts have been:

-   `dev`: run the entry point with `tsx watch`
-   `build`: compile TypeScript with `tsc`
-   `start`: build, then run the compiled entry point
-   `test`: run tests with Node's built-in test runner through `tsx`

Confirm the actual scripts in `package.json` before relying on this list
in the published README. For an individual test file, the current
workflow includes commands such as:

``` bash
npx tsx --test src/Tests/Client.test.ts
```

The test command reported by the testing checkpoint is:

``` bash
npm test src/Tests/Client.test.ts
```

Use whichever command is supported by the current `package.json`
scripts.

## Testing approach

Tests use Node.js's built-in test runner (`node:test`) and strict
assertions (`node:assert/strict`). Tests should be deterministic and use
the virtual clock, not real-time waits.

Existing test areas include:

-   **Simulator:** event scheduling and virtual-clock behavior.
-   **Network:** request and response delivery with configured latency.
-   **Server:** request handling, configuration validation, FIFO
    behavior, and multiple workers.
-   **Client:** response-time calculation, request-specific timing,
    queue-wait contribution, and cleanup of start-time records.

### Response-time metric test report

The latest checkpoint report records three passing client tests and no
failures:

1.  **Basic response time** --- with network latency `30`, server
    processing time `20`, one worker, and a request starting at `t=0`,
    the expected and observed response time is `80`.
2.  **Independent request timing and queue waiting** --- with network
    latency `30`, processing time `30`, one worker, and two requests
    generated at interval `10`, the reported response times are `90` and
    `110`. This checks that each response is matched to its own request
    start time and that queue waiting contributes to response time.
3.  **Start-time cleanup** --- confirms the start-time entries are no
    longer available after both responses complete.

These results describe the latest reported test run. Run the test suite
again before publishing to confirm the repository's current state.

## Modeling assumptions and current limitations

-   This is a simplified model, not a real HTTP server or a packet-level
    network simulator.
-   Time is virtual and advances only through scheduled events.
-   Network latency is currently fixed by configuration.
-   Server processing time is currently fixed by configuration rather
    than derived from request characteristics.
-   Workload arrivals currently use a fixed interval.
-   The server's route handling is illustrative; there is no real
    database or external service.
-   Client-side computation is not modeled as a separate processing
    stage.
-   Response time is currently the main performance metric. Percentiles
    and broader capacity analysis have not yet been implemented.

## Development roadmap

The next design discussion is about making server processing time depend
on the amount of work represented by a request. One proposed
deterministic model is:

``` text
processing time = operation baseline + (work amount × cost per unit)
```

For example, a route could have a baseline cost, with additional cost
based on the number of records processed. The exact request field and
configuration design have **not been finalized or implemented yet**.

Possible future work, in a deliberate order:

1.  Define a deterministic workload-size property (for example, record
    count) and an operation-based processing-cost model.
2.  Test processing durations for different operations and workload
    sizes.
3.  Support variable arrival intervals.
4.  Introduce configurable variable or random arrival and service-time
    models.
5.  Collect latency samples and calculate p50, p95, and p99.
6.  Run capacity and bottleneck experiments by varying arrival rates,
    worker counts, and processing costs.

Treat this roadmap as a plan, not as a claim that those features already
exist.

## Learning and contribution principles

This is also a learning project. Changes should be made incrementally:

-   Explain the behavior being added before implementing it.
-   Make one conceptual change at a time.
-   Prefer clear types and simple data structures over premature
    abstractions.
-   State the exact files and changes required.
-   Add deterministic tests for new behavior before considering a
    feature complete.
-   Keep the distinction between a modeled input (such as processing
    cost) and an observed metric (such as response time) explicit.

## Current checkpoint

The simulator's current working scope includes virtual-time event
scheduling, configurable network latency, a FIFO server queue,
configurable worker count and fixed processing time, fixed-interval
workload generation, request/response IDs, and basic response-time
metrics.

The basic response-time feature has been reported as tested. The next
implementation step is still a design decision: choose how a request
expresses its workload size and how the server maps that workload to
deterministic processing time.
