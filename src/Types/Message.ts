
export type Message = {
    from: string;
    to: string;
    method: string;
    route: string;
    statusCode?: number;
    data: string;
}

export type MessageEnvelope = {
    id: string;
    message: Message;
}
