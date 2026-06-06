import { useEffect, useState } from "react";
import "./popup.css";

interface Folder {
    id: string;
    name: string;
}

export default function App() {
    const [folders, setFolders] =
        useState<Folder[]>([]);

    const [folderName, setFolderName] =
        useState("");

    async function loadFolders() {
        const result =
            await chrome.storage.local.get(
                "folders"
            );

        setFolders(
            (result.folders as Folder[]) || []
        );
    }

    async function createFolder() {
        if (!folderName.trim()) {
            return;
        }

        const newFolder: Folder = {
            id: crypto.randomUUID(),
            name: folderName,
        };

        const updated = [
            ...folders,
            newFolder,
        ];

        await chrome.storage.local.set({
            folders: updated,
        });

        setFolders(updated);
        setFolderName("");
    }

    async function deleteFolder(
        id: string
    ) {
        const updated = folders.filter(
            (folder) => folder.id !== id
        );

        await chrome.storage.local.set({
            folders: updated,
        });

        setFolders(updated);
    }

    useEffect(() => {
        loadFolders();
    }, []);

    return (
        <div className="container">
            <h2>Folders</h2>

            <input
                type="text"
                placeholder="Folder name"
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
                Create Folder
            </button>

            <ul>
                {folders.map((folder) => (
                    <li key={folder.id}>
                        <span>
                            {folder.name}
                        </span>

                        <button
                            onClick={() =>
                                deleteFolder(folder.id)
                            }
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}