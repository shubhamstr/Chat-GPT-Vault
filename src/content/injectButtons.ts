import { extractMessageText, extractMessageMarkdown } from "./chatExtractor";
import { saveNote, savePrompt } from "../services/storage";
import { copyText, copyMarkdown } from "../services/clipboard";
import { generateMarkdown } from "../services/markdown";
import { showToast } from "../utils/toast";
import type { NoteItem, PromptItem } from "../types";

// SVGs for buttons
const SAVE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`;
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const MARKDOWN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;

export function injectWorkspaceButtons(messageEl: HTMLElement) {
    if (messageEl.getAttribute("data-cw-injected") === "true") {
        return;
    }

    const role = messageEl.getAttribute("data-message-author-role");
    if (!role) return;

    // Mark as processed
    messageEl.setAttribute("data-cw-injected", "true");

    const container = document.createElement("div");
    container.className = "chatgpt-workspace-btn-container";

    if (role === "user") {
        const saveBtn = document.createElement("button");
        saveBtn.className = "chatgpt-workspace-btn";
        saveBtn.innerHTML = `${SAVE_ICON}<span>💾 Save Prompt</span>`;
        saveBtn.addEventListener("click", () => handleSavePrompt(messageEl));
        container.appendChild(saveBtn);
    } else if (role === "assistant") {
        // Save Note
        const saveNoteBtn = document.createElement("button");
        saveNoteBtn.className = "chatgpt-workspace-btn";
        saveNoteBtn.innerHTML = `${SAVE_ICON}<span>📝 Save Note</span>`;
        saveNoteBtn.addEventListener("click", () => handleSaveNote(messageEl));
        container.appendChild(saveNoteBtn);

        // Copy Plain Text
        const copyBtn = document.createElement("button");
        copyBtn.className = "chatgpt-workspace-btn";
        copyBtn.innerHTML = `${COPY_ICON}<span>📋 Copy</span>`;
        copyBtn.addEventListener("click", () => handleCopyText(messageEl));
        container.appendChild(copyBtn);

        // Copy Markdown
        const copyMDBtn = document.createElement("button");
        copyMDBtn.className = "chatgpt-workspace-btn";
        copyMDBtn.innerHTML = `${MARKDOWN_ICON}<span>📄 Copy Markdown</span>`;
        copyMDBtn.addEventListener("click", () => handleCopyMarkdown(messageEl));
        container.appendChild(copyMDBtn);
    }

    // Append at the bottom of the message container
    messageEl.appendChild(container);
}

// Generate default title from content
function getDefaultTitle(content: string): string {
    const cleanStr = content.trim().replace(/\n/g, " ");
    if (cleanStr.length <= 30) {
        return cleanStr || "Untitled";
    }
    return cleanStr.substring(0, 27) + "...";
}

function getFriendlyErrorMessage(err: unknown, fallback: string): string {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg.includes("storage is unavailable") || errMsg.includes("Extension context invalidated")) {
        return "Extension updated! Please refresh the page.";
    }
    return fallback;
}

async function handleSavePrompt(messageEl: HTMLElement) {
    try {
        const text = extractMessageText(messageEl);
        if (!text) {
            showToast("Cannot save empty prompt", { type: "error" });
            return;
        }

        const id = crypto.randomUUID();
        const defaultTitle = getDefaultTitle(text);

        const promptItem: PromptItem = {
            id,
            title: defaultTitle,
            content: text,
            createdAt: new Date().toISOString(),
            chatUrl: window.location.href,
            tags: [],
        };

        // Save immediately with default title
        await savePrompt(promptItem);

        // Offer custom title/tags editing in Toast
        showToast("Prompt saved!", {
            type: "success",
            interactive: true,
            defaultTitle,
            defaultTags: [],
            onSave: async (newTitle, tags) => {
                try {
                    promptItem.title = newTitle;
                    promptItem.tags = tags;
                    await savePrompt(promptItem);
                    showToast("Prompt updated!", { type: "success", duration: 1500 });
                } catch (err) {
                    console.error("Failed to update prompt:", err);
                    showToast(getFriendlyErrorMessage(err, "Error updating prompt"), { type: "error" });
                }
            },
        });
    } catch (err) {
        console.error("Failed to save prompt:", err);
        showToast(getFriendlyErrorMessage(err, "Error saving prompt"), { type: "error" });
    }
}

async function handleSaveNote(messageEl: HTMLElement) {
    try {
        const text = extractMessageText(messageEl);
        if (!text) {
            showToast("Cannot save empty note", { type: "error" });
            return;
        }

        const id = crypto.randomUUID();
        const defaultTitle = getDefaultTitle(text);

        const noteItem: NoteItem = {
            id,
            title: defaultTitle,
            content: text,
            createdAt: new Date().toISOString(),
            chatUrl: window.location.href,
            tags: [],
        };

        // Save immediately with default title
        await saveNote(noteItem);

        // Offer custom title/tags editing in Toast
        showToast("Note saved!", {
            type: "success",
            interactive: true,
            defaultTitle,
            defaultTags: [],
            onSave: async (newTitle, tags) => {
                try {
                    noteItem.title = newTitle;
                    noteItem.tags = tags;
                    await saveNote(noteItem);
                    showToast("Note updated!", { type: "success", duration: 1500 });
                } catch (err) {
                    console.error("Failed to update note:", err);
                    showToast(getFriendlyErrorMessage(err, "Error updating note"), { type: "error" });
                }
            },
        });
    } catch (err) {
        console.error("Failed to save note:", err);
        showToast(getFriendlyErrorMessage(err, "Error saving note"), { type: "error" });
    }
}

async function handleCopyText(messageEl: HTMLElement) {
    try {
        const text = extractMessageText(messageEl);
        await copyText(text);
        showToast("Copied to Clipboard!", { type: "success", duration: 2000 });
    } catch (err) {
        console.error("Failed to copy text:", err);
        showToast("Error copying text", { type: "error" });
    }
}

async function handleCopyMarkdown(messageEl: HTMLElement) {
    try {
        const rawMarkdown = extractMessageMarkdown(messageEl);
        const formattedMarkdown = generateMarkdown(rawMarkdown);
        await copyMarkdown(formattedMarkdown);
        showToast("Copied Markdown to Clipboard!", { type: "success", duration: 2000 });
    } catch (err) {
        console.error("Failed to copy markdown:", err);
        showToast("Error copying markdown", { type: "error" });
    }
}
