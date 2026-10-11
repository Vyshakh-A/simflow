//Simulator.ts

import type { Event, ScheduledEvent } from "./Types/Events.js";

export class Simulator {
    private clock: number = 0;
    private events: Event[] = [];
    private requestId: number = 1;

    schedule(event: Event) {
        this.events.push(event);
    }

    run() {
        while(this.events.length > 0) {
            this.events.sort((a, b) => a.time - b.time);

            const event = this.events.shift()!;

            this.clock = event.time;

            console.log(`[t=${this.clock}ms]`);

            event.action();
        }
    }

    scheduleIn(delay: number, event: ScheduledEvent) {
        const scheduledEvent: Event = {
            time: this.clock + delay,
            name: event.name,
            action: event.action,
        }
        
        this.events.push(scheduledEvent);
    }

    createRequestId(requestFrom: string) {
        const id = this.requestId;
        this.requestId++;
        return `${requestFrom}-${id}`
    }

    getTime() {
        return this.clock;
    }
}