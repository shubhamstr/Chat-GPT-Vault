import type { ChatMessage } from "../types";

export function extractChat(): ChatMessage[] {
    const messages: ChatMessage[] = [];

    const blocks = document.querySelectorAll(
        "[data-message-author-role]"
    );

    blocks.forEach((block) => {
        const role =
            block.getAttribute(
                "data-message-author-role"
            ) === "user"
                ? "user"
                : "assistant";

        messages.push({
            role,
            content:
                block.textContent || "",
        });
    });

    return messages;
}