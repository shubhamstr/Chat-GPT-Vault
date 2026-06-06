import { extractChat } from "./chatExtractor";
import { generateMarkdown } from "../services/markdown";
import { downloadFile } from "../utils/download";
import { createToolbar } from "./toolbar";

const toolbar =
    createToolbar();

toolbar
    .querySelector("#copy-md")
    ?.addEventListener(
        "click",
        async () => {
            const chat =
                extractChat();

            const markdown =
                generateMarkdown(chat);

            await navigator.clipboard.writeText(
                markdown
            );

            alert(
                "Copied as Markdown"
            );
        }
    );

toolbar
    .querySelector("#download-md")
    ?.addEventListener(
        "click",
        () => {
            const chat =
                extractChat();

            const markdown =
                generateMarkdown(chat);

            downloadFile(
                "chat.md",
                markdown
            );
        }
    );