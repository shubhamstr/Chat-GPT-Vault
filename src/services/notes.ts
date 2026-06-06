export async function saveNote(
    note: any
) {
    const result =
        await chrome.storage.local.get(
            "notes"
        );

    const notes =
        result.notes || [];

    notes.push(note);

    await chrome.storage.local.set({
        notes,
    });
}