import { extractChat } from "./chatExtractor";
import { generateMarkdown } from "../services/markdown";
import { createToolbar } from "./toolbar";
import { saveNote } from "../services/notes";
import { savePrompt } from "../services/prompts";

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
                "Markdown copied"
            );
        }
    );

toolbar
    .querySelector("#copy-text")
    ?.addEventListener(
        "click",
        async () => {
            const text =
                document.body.innerText;

            await navigator.clipboard.writeText(
                text
            );

            alert("Text copied");
        }
    );

toolbar
    .querySelector("#save-note")
    ?.addEventListener(
        "click",
        async () => {
            const title =
                prompt(
                    "Note title"
                ) || "Untitled";

            const text =
                window.getSelection()?.toString() ||
                "";

            await saveNote({
                id:
                    crypto.randomUUID(),
                title,
                content: text,
                createdAt:
                    new Date().toISOString(),
            });

            alert(
                "Note saved"
            );
        }
    );

toolbar
    .querySelector("#save-prompt")
    ?.addEventListener(
        "click",
        async () => {
            const title =
                prompt(
                    "Prompt title"
                ) || "Untitled";

            const text =
                window.getSelection()?.toString() ||
                "";

            await savePrompt({
                id:
                    crypto.randomUUID(),
                title,
                content: text,
                createdAt:
                    new Date().toISOString(),
            });

            alert(
                "Prompt saved"
            );
        }
    );