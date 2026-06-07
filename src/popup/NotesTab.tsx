import { useState } from "react";
import type { MouseEvent } from "react";
import type { NoteItem } from "../types";
import { copyText } from "../services/clipboard";

interface NotesTabProps {
    notes: NoteItem[];
    onDelete: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
}

export default function NotesTab({ notes, onDelete, onUpdateTags }: NotesTabProps) {
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
    const [activeInputId, setActiveInputId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleCopy = async (note: NoteItem, e: MouseEvent) => {
        e.stopPropagation();
        try {
            await copyText(note.content);
            // We can show a temporary button feedback, or let it work silently
            const btn = e.currentTarget as HTMLButtonElement;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#10a37f"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const handleAddTag = (noteId: string) => {
        setActiveInputId(noteId);
        setTagInputs((prev) => ({ ...prev, [noteId]: "" }));
    };

    const handleTagSubmit = (note: NoteItem) => {
        const inputVal = tagInputs[note.id]?.trim();
        if (inputVal) {
            const rawTags = inputVal.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
            const updatedTags = Array.from(new Set([...note.tags, ...rawTags]));
            onUpdateTags(note.id, updatedTags);
        }
        setActiveInputId(null);
    };

    const handleRemoveTag = (note: NoteItem, tagToRemove: string) => {
        const updatedTags = note.tags.filter((t) => t !== tagToRemove);
        onUpdateTags(note.id, updatedTags);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "Unknown Date";
        }
    };

    if (notes.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-text">No notes saved yet</p>
                <p className="empty-subtext">Click the "Save Note" button in ChatGPT to capture important answers.</p>
            </div>
        );
    }

    return (
        <div className="list-content">
            {notes.map((note) => {
                const isExpanded = !!expandedIds[note.id];
                const isAddingTag = activeInputId === note.id;
                const isLong = note.content.length > 180;

                return (
                    <div key={note.id} className="item-card">
                        <div className="item-header">
                            <h4 className="item-title">{note.title}</h4>
                            <span className="item-date">{formatDate(note.createdAt)}</span>
                        </div>

                        <p className={`item-preview ${isExpanded ? "expanded" : ""}`}>
                            {note.content}
                        </p>

                        {isLong && (
                            <button className="expand-toggle" onClick={() => toggleExpand(note.id)}>
                                {isExpanded ? "Show less" : "Show more"}
                            </button>
                        )}

                        <div className="item-tags">
                            {note.tags.map((tag) => (
                                <span key={tag} className="tag-badge" title="Click to remove tag" style={{ cursor: "pointer" }} onClick={() => handleRemoveTag(note, tag)}>
                                    {tag} &times;
                                </span>
                            ))}

                            {isAddingTag ? (
                                <div className="tag-edit-wrapper">
                                    <input
                                        type="text"
                                        className="tag-input"
                                        placeholder="Add tag(s)..."
                                        value={tagInputs[note.id] || ""}
                                        autoFocus
                                        onChange={(e) => setTagInputs((prev) => ({ ...prev, [note.id]: e.target.value }))}
                                        onBlur={() => handleTagSubmit(note)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleTagSubmit(note);
                                            if (e.key === "Escape") setActiveInputId(null);
                                        }}
                                    />
                                </div>
                            ) : (
                                <button className="add-tag-btn" onClick={() => handleAddTag(note.id)}>
                                    <span>+</span> Add Tag
                                </button>
                            )}
                        </div>

                        <div className="item-footer">
                            {note.chatUrl ? (
                                <a href={note.chatUrl} target="_blank" rel="noopener noreferrer" className="item-chat-link" title="Open chat context">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    <span>Source Chat</span>
                                </a>
                            ) : (
                                <div />
                            )}

                            <div className="item-actions">
                                <button className="action-btn" onClick={(e) => handleCopy(note, e)} title="Copy raw text">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                                <button className="action-btn delete" onClick={() => onDelete(note.id)} title="Delete note">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
