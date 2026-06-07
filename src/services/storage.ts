import type { NoteItem, PromptItem } from "../types";

export async function getNotes(): Promise<NoteItem[]> {
    const result = await chrome.storage.local.get("notes");
    return (result.notes as NoteItem[]) || [];
}

export async function saveNote(note: NoteItem): Promise<void> {
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
    const notes = await getNotes();
    const filtered = notes.filter((item) => item.id !== id);
    await chrome.storage.local.set({ notes: filtered });
}

export async function getPrompts(): Promise<PromptItem[]> {
    const result = await chrome.storage.local.get("prompts");
    return (result.prompts as PromptItem[]) || [];
}

export async function savePrompt(prompt: PromptItem): Promise<void> {
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
    const prompts = await getPrompts();
    const filtered = prompts.filter((item) => item.id !== id);
    await chrome.storage.local.set({ prompts: filtered });
}
