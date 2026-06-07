import { useState } from "react";
import type { MouseEvent } from "react";
import type { PromptItem } from "../types";
import { copyText } from "../services/clipboard";

interface PromptsTabProps {
    prompts: PromptItem[];
    onDelete: (id: string) => void;
    onUpdateTags: (id: string, tags: string[]) => void;
}

export default function PromptsTab({ prompts, onDelete, onUpdateTags }: PromptsTabProps) {
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
    const [activeInputId, setActiveInputId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleCopy = async (prompt: PromptItem, e: MouseEvent) => {
        e.stopPropagation();
        try {
            await copyText(prompt.content);
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

    const handleAddTag = (promptId: string) => {
        setActiveInputId(promptId);
        setTagInputs((prev) => ({ ...prev, [promptId]: "" }));
    };

    const handleTagSubmit = (prompt: PromptItem) => {
        const inputVal = tagInputs[prompt.id]?.trim();
        if (inputVal) {
            const rawTags = inputVal.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
            const updatedTags = Array.from(new Set([...prompt.tags, ...rawTags]));
            onUpdateTags(prompt.id, updatedTags);
        }
        setActiveInputId(null);
    };

    const handleRemoveTag = (prompt: PromptItem, tagToRemove: string) => {
        const updatedTags = prompt.tags.filter((t) => t !== tagToRemove);
        onUpdateTags(prompt.id, updatedTags);
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

    if (prompts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💾</div>
                <p className="empty-text">No prompts saved yet</p>
                <p className="empty-subtext">Click the "Save Prompt" button in ChatGPT to capture custom templates.</p>
            </div>
        );
    }

    return (
        <div className="list-content">
            {prompts.map((prompt) => {
                const isExpanded = !!expandedIds[prompt.id];
                const isAddingTag = activeInputId === prompt.id;
                const isLong = prompt.content.length > 180;

                return (
                    <div key={prompt.id} className="item-card">
                        <div className="item-header">
                            <h4 className="item-title">{prompt.title}</h4>
                            <span className="item-date">{formatDate(prompt.createdAt)}</span>
                        </div>

                        <p className={`item-preview ${isExpanded ? "expanded" : ""}`}>
                            {prompt.content}
                        </p>

                        {isLong && (
                            <button className="expand-toggle" onClick={() => toggleExpand(prompt.id)}>
                                {isExpanded ? "Show less" : "Show more"}
                            </button>
                        )}

                        <div className="item-tags">
                            {prompt.tags.map((tag) => (
                                <span key={tag} className="tag-badge" title="Click to remove tag" style={{ cursor: "pointer" }} onClick={() => handleRemoveTag(prompt, tag)}>
                                    {tag} &times;
                                </span>
                            ))}

                            {isAddingTag ? (
                                <div className="tag-edit-wrapper">
                                    <input
                                        type="text"
                                        className="tag-input"
                                        placeholder="Add tag(s)..."
                                        value={tagInputs[prompt.id] || ""}
                                        autoFocus
                                        onChange={(e) => setTagInputs((prev) => ({ ...prev, [prompt.id]: e.target.value }))}
                                        onBlur={() => handleTagSubmit(prompt)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleTagSubmit(prompt);
                                            if (e.key === "Escape") setActiveInputId(null);
                                        }}
                                    />
                                </div>
                            ) : (
                                <button className="add-tag-btn" onClick={() => handleAddTag(prompt.id)}>
                                    <span>+</span> Add Tag
                                </button>
                            )}
                        </div>

                        <div className="item-footer">
                            {prompt.chatUrl ? (
                                <a href={prompt.chatUrl} target="_blank" rel="noopener noreferrer" className="item-chat-link" title="Open chat context">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    <span>Source Chat</span>
                                </a>
                            ) : (
                                <div />
                            )}

                            <div className="item-actions">
                                <button className="action-btn" onClick={(e) => handleCopy(prompt, e)} title="Copy raw text">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                                <button className="action-btn delete" onClick={() => onDelete(prompt.id)} title="Delete prompt">
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
