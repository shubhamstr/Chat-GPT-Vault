import type { NoteItem, PromptItem } from "../types";

function isStorageAvailable(): boolean {
    return typeof chrome !== "undefined" && typeof chrome.storage !== "undefined" && typeof chrome.storage.local !== "undefined";
}

export async function getNotes(): Promise<NoteItem[]> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const result = await chrome.storage.local.get("notes");
    const notes = (result.notes as NoteItem[]) || [];
    return notes.map((note) => ({
        ...note,
        tags: Array.isArray(note.tags) ? note.tags : [],
    }));
}

export async function saveNote(note: NoteItem): Promise<void> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const notes = await getNotes();
    const index = notes.findIndex((item) => item.id === note.id);
    if (index >= 0) {
        notes[index] = note;
    } else {
        notes.push(note);
    }
    await chrome.storage.local.set({ notes });
}

export async function deleteNote(id: string): Promise<void> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const notes = await getNotes();
    const filtered = notes.filter((item) => item.id !== id);
    await chrome.storage.local.set({ notes: filtered });
}

export async function getPrompts(): Promise<PromptItem[]> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const result = await chrome.storage.local.get("prompts");
    const prompts = (result.prompts as PromptItem[]) || [];
    return prompts.map((prompt) => ({
        ...prompt,
        tags: Array.isArray(prompt.tags) ? prompt.tags : [],
    }));
}

export async function savePrompt(prompt: PromptItem): Promise<void> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const prompts = await getPrompts();
    const index = prompts.findIndex((item) => item.id === prompt.id);
    if (index >= 0) {
        prompts[index] = prompt;
    } else {
        prompts.push(prompt);
    }
    await chrome.storage.local.set({ prompts });
}

export async function deletePrompt(id: string): Promise<void> {
    if (!isStorageAvailable()) {
        throw new Error("Extension storage is unavailable. Please refresh the page.");
    }
    const prompts = await getPrompts();
    const filtered = prompts.filter((item) => item.id !== id);
    await chrome.storage.local.set({ prompts: filtered });
}
