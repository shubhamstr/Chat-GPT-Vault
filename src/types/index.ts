export interface PromptItem {
    id: string;
    title: string;
    content: string;
    category: string;
}

export interface NoteItem {
    id: string;
    title: string;
    content: string;
    tags: string[];
}

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}