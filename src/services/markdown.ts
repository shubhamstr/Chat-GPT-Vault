import { ChatMessage } from "../types";

export function generateMarkdown(
    messages: ChatMessage[]
) {
    let md = "# ChatGPT Export\n\n";

    messages.forEach((msg) => {
        md += `## ${msg.role}\n\n`;
        md += msg.content;
        md += "\n\n";
    });

    return md;
}