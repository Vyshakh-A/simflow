//event.ts
export type Event = {
    time: number;
    name: string;
    action: () => void;
};

export type ScheduledEvent = {
    name: string;
    action: () => void;
}
