export async function getFolders() {
    const result =
        await chrome.storage.local.get('folders')

    return result.folders || []
}

export async function saveFolders(
    folders: any[]
) {
    await chrome.storage.local.set({
        folders,
    })
}

export async function getSelectedChats() {
    const result =
        await chrome.storage.local.get(
            'selectedChats'
        )

    return result.selectedChats || []
}