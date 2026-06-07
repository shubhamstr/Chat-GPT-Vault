export function generateMarkdown(content: string): string {
    return `# ChatGPT Response\n\n${content}`;
}

export function htmlToMarkdown(element: HTMLElement): string {
    return convertNodeToMarkdown(element).trim();
}

function convertNodeToMarkdown(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toUpperCase();

    // Skip our own injected action buttons container
    if (element.classList.contains("chatgpt-workspace-btn-container")) {
        return "";
    }

    // Process children recursively
    const childMarkdown = Array.from(element.childNodes)
        .map(convertNodeToMarkdown)
        .join("");

    switch (tagName) {
        case "P":
            return `${childMarkdown}\n\n`;
        case "H1":
            return `# ${childMarkdown}\n\n`;
        case "H2":
            return `## ${childMarkdown}\n\n`;
        case "H3":
            return `### ${childMarkdown}\n\n`;
        case "H4":
            return `#### ${childMarkdown}\n\n`;
        case "H5":
            return `##### ${childMarkdown}\n\n`;
        case "H6":
            return `###### ${childMarkdown}\n\n`;
        case "STRONG":
        case "B":
            return `**${childMarkdown}**`;
        case "EM":
        case "I":
            return `*${childMarkdown}*`;
        case "CODE": {
            const isBlock = element.parentElement?.tagName.toUpperCase() === "PRE";
            return isBlock ? childMarkdown : `\`${childMarkdown}\``;
        }
        case "PRE": {
            const codeEl = element.querySelector("code");
            const codeText = codeEl ? codeEl.textContent || "" : element.textContent || "";
            let lang = "";
            const classList = Array.from(codeEl?.classList || []);
            for (const cls of classList) {
                if (cls.startsWith("language-")) {
                    lang = cls.replace("language-", "");
                    break;
                }
            }
            return `\`\`\`${lang}\n${codeText.trim()}\n\`\`\`\n\n`;
        }
        case "UL":
            return `${childMarkdown}\n`;
        case "OL":
            return `${childMarkdown}\n`;
        case "LI": {
            const parent = element.parentElement;
            const isOrdered = parent?.tagName.toUpperCase() === "OL";
            if (isOrdered) {
                const index = Array.from(parent.children).indexOf(element) + 1;
                return `${index}. ${childMarkdown}\n`;
            }
            return `- ${childMarkdown}\n`;
        }
        case "BLOCKQUOTE":
            return `> ${childMarkdown.trim().replace(/\n/g, "\n> ")}\n\n`;
        case "A": {
            const href = element.getAttribute("href") || "";
            return `[${childMarkdown}](${href})`;
        }
        case "BR":
            return "\n";
        case "DIV":
            return `${childMarkdown}${element.classList.contains("markdown") ? "\n\n" : ""}`;
        default:
            return childMarkdown;
    }
}