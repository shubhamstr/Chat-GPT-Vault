import { useEffect, useState } from 'react'
import "./popup.css";

export default function App() {
    const [folders, setFolders] =
        useState<any[]>([])

    const [folderName, setFolderName] =
        useState('')

    async function loadFolders() {
        const result =
            await chrome.storage.local.get(
                'folders'
            )

        setFolders(result.folders || [])
    }

    async function createFolder() {
        const newFolder = {
            id: crypto.randomUUID(),
            name: folderName,
        }

        const updated = [
            ...folders,
            newFolder,
        ]

        await chrome.storage.local.set({
            folders: updated,
        })

        setFolders(updated)
        setFolderName('')
    }

    useEffect(() => {
        loadFolders()
    }, [])

    return (
        <div
            style={{
                width: 300,
                padding: 15,
            }}
        >
            <h2>Folders</h2>

            <input
                value={folderName}
                onChange={(e) =>
                    setFolderName(
                        e.target.value
                    )
                }
            />

            <button
                onClick={createFolder}
            >
                Create
            </button>

            <ul>
                {folders.map((folder) => (
                    <li key={folder.id}>
                        {folder.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}