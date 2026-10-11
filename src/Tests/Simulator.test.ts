//Simulator.test.ts

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Simulator } from '../Simulator.js';

test("Events scheduled at different times execute chronologically", () => {
    const simulator = new Simulator();
    const executedEvents: string[] = [];

    simulator.schedule({
        time: 30,
        name: "Later",
        action: () => {
            executedEvents.push("Later");
        },
    });
    simulator.schedule({
        time: 10,
        name: "First",
        action: () => {
            executedEvents.push("First");
        },
    });
    simulator.schedule({
        time: 20,
        name: "Middle",
        action: () => {
            executedEvents.push("Middle");
        },
    });

    simulator.run();

    assert.deepEqual(executedEvents, ["First", "Middle", "Later"]);
});

test("Multiple events at the same time", () => {
    const simulator = new Simulator();
    const executedEvents: string[] = [];

    simulator.schedule({
        time: 30,
        name: "Later",
        action: () => {
            executedEvents.push("Later");
        },
    });
    simulator.schedule({
        time: 30,
        name: "First",
        action: () => {
            executedEvents.push("First");
        },
    });
    simulator.schedule({
        time: 30,
        name: "Middle",
        action: () => {
            executedEvents.push("Middle");
        },
    });
    
    simulator.run();
    assert.deepEqual(executedEvents, ["Later", "First", "Middle"]);
})

test("Event does not execute before its scheduled time", () => {
    const simulator = new Simulator();
    const executionTimes: number[] = [];

    simulator.scheduleIn(30, {
        name: "First",
        action: () => {
            executionTimes.push(simulator.getTime());
        },
    });

    simulator.run();

    assert.deepEqual(executionTimes, [30]);
});

test("Event time equals current virtual time plus delay", () => {
    const simulator = new Simulator();
    let executionTime: number = 0;

    simulator.schedule({
        time: 20,
        name: "First",
        action: () => {
            simulator.scheduleIn(30, {
                name: "Later",
                action: () => {
                    executionTime = simulator.getTime();
                },
            });
        },
    });

    simulator.run();

    assert.equal(executionTime, 50);
});