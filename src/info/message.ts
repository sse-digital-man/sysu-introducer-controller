export enum MessageKind {
    Watcher = 0,
    Admin = 1,
    Command = 2,
    Assistant = 3,
}

export interface Message {
    kind: MessageKind;
    content: string;
}

export const USER = "user";
export const ASSISTANT = "assistant";

export interface HistoryMessage {
    role: "user" | "assistant";
    content: string;
}
