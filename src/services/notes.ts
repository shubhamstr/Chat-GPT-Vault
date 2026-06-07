export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export async function saveNote(
    note: Note
) {
    const result =
        await chrome.storage.local.get(
            "notes"
        );

    const notes: Note[] =
        (result.notes as Note[]) ||
        [];

    notes.push(note);

    await chrome.storage.local.set({
        notes,
    });
}

export async function getNotes() {
    const result =
        await chrome.storage.local.get(
            "notes"
        );

    return (
        (result.notes as Note[]) ||
        []
    );
}