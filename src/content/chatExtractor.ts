import { htmlToMarkdown } from "../services/markdown";

export function extractMessageText(messageEl: HTMLElement): string {
    // If it's an assistant message, try to extract specifically from the .markdown block
    // to bypass ChatGPT's own native action buttons (thumbs up, copy, read-aloud etc.)
    const markdownContainer = messageEl.querySelector(".markdown") as HTMLElement;
    if (markdownContainer) {
        const clone = markdownContainer.cloneNode(true) as HTMLElement;
        const injected = clone.querySelectorAll(".chatgpt-workspace-btn-container");
        injected.forEach((el) => el.remove());
        return clone.innerText || clone.textContent || "";
    }

    // Otherwise, clone the whole message block and remove our injected elements
    const clone = messageEl.cloneNode(true) as HTMLElement;
    const injected = clone.querySelectorAll(".chatgpt-workspace-btn-container");
    injected.forEach((el) => el.remove());
    return clone.innerText || clone.textContent || "";
}

export function extractMessageMarkdown(messageEl: HTMLElement): string {
    const markdownContainer = messageEl.querySelector(".markdown") as HTMLElement;
    if (markdownContainer) {
        return htmlToMarkdown(markdownContainer);
    }
    return htmlToMarkdown(messageEl);
}