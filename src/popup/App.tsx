import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import NotesTab from "./NotesTab";
import PromptsTab from "./PromptsTab";
import {
    getNotes,
    deleteNote,
    saveNote,
    getPrompts,
    deletePrompt,
    savePrompt
} from "../services/storage";
import type { NoteItem, PromptItem } from "../types";
import "./popup.css";

export default function App() {
    const [tab, setTab] = useState<"notes" | "prompts">("notes");
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [prompts, setPrompts] = useState<PromptItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const fetchedNotes = await getNotes();
                const fetchedPrompts = await getPrompts();
                setNotes(fetchedNotes);
                setPrompts(fetchedPrompts);
            } catch (err) {
                console.error("Failed to load vault data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);
            setNotes((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    };

    const handleDeletePrompt = async (id: string) => {
        try {
            await deletePrompt(id);
            setPrompts((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Failed to delete prompt:", err);
        }
    };

    const handleUpdateNoteTags = async (id: string, newTags: string[]) => {
        try {
            const note = notes.find((item) => item.id === id);
            if (note) {
                const updatedNote = { ...note, tags: newTags };
                await saveNote(updatedNote);
                setNotes((prev) =>
                    prev.map((item) => (item.id === id ? updatedNote : item))
                );
            }
        } catch (err) {
            console.error("Failed to update note tags:", err);
        }
    };

    const handleUpdatePromptTags = async (id: string, newTags: string[]) => {
        try {
            const promptItem = prompts.find((item) => item.id === id);
            if (promptItem) {
                const updatedPrompt = { ...promptItem, tags: newTags };
                await savePrompt(updatedPrompt);
                setPrompts((prev) =>
                    prev.map((item) => (item.id === id ? updatedPrompt : item))
                );
            }
        } catch (err) {
            console.error("Failed to update prompt tags:", err);
        }
    };

    // Client-side filtering logic
    const filterItems = <T extends NoteItem | PromptItem>(items: T[]): T[] => {
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.content.toLowerCase().includes(q) ||
                (item.tags || []).some((tag) => tag.toLowerCase().includes(q))
        );
    };

    const filteredNotes = filterItems(notes);
    const filteredPrompts = filterItems(prompts);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="brand">
                    <span className="brand-icon">⚡</span>
                    <h1 className="brand-title">ChatGPT Vault</h1>
                </div>
                <span className="version">v0.0.1</span>
            </header>

            <nav className="tabs">
                <button
                    className={`tab-btn ${tab === "notes" ? "active" : ""}`}
                    onClick={() => {
                        setTab("notes");
                        setSearchQuery("");
                    }}
                >
                    <span>📝 Notes</span>
                    <span className="tab-count">{notes.length}</span>
                </button>
                <button
                    className={`tab-btn ${tab === "prompts" ? "active" : ""}`}
                    onClick={() => {
                        setTab("prompts");
                        setSearchQuery("");
                    }}
                >
                    <span>💾 Prompts</span>
                    <span className="tab-count">{prompts.length}</span>
                </button>
            </nav>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={
                    tab === "notes"
                        ? "Search notes, content, or tags..."
                        : "Search prompts, content, or tags..."
                }
            />

            {loading ? (
                <div className="empty-state">
                    <p className="empty-text">Loading Vault...</p>
                </div>
            ) : tab === "notes" ? (
                <NotesTab
                    notes={filteredNotes}
                    onDelete={handleDeleteNote}
                    onUpdateTags={handleUpdateNoteTags}
                />
            ) : (
                <PromptsTab
                    prompts={filteredPrompts}
                    onDelete={handleDeletePrompt}
                    onUpdateTags={handleUpdatePromptTags}
                />
            )}
        </div>
    );
}