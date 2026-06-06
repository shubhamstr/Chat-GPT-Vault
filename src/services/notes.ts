export async function saveNote(
    note: unknown
) {
    const result =
        await chrome.storage.local.get(
            "notes"
        );

    const notes: unknown[] =
        (result.notes as unknown[]) ||
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
        (result.notes as unknown[]) ||
        []
    );
}