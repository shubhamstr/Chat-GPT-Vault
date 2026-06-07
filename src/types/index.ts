export interface SavedItem {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    chatUrl: string;
    tags: string[];
}

export type PromptItem = SavedItem;
export type NoteItem = SavedItem;

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}