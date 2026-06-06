import { findChats } from "../utils/chatScanner";

async function updateSelectedChats(
    chatId: string,
    checked: boolean
) {
    const result = await chrome.storage.local.get(
        "selectedChats"
    );

    const selected: string[] =
        (result.selectedChats as string[]) || [];

    if (checked) {
        if (!selected.includes(chatId)) {
            selected.push(chatId);
        }
    } else {
        const index = selected.indexOf(chatId);

        if (index !== -1) {
            selected.splice(index, 1);
        }
    }

    await chrome.storage.local.set({
        selectedChats: selected,
    });
}

function injectCheckboxes() {
    const chats = findChats();

    chats.forEach((chat) => {
        const link = chat as HTMLAnchorElement;

        if (
            link.parentElement?.querySelector(
                ".cgpt-checkbox"
            )
        ) {
            return;
        }

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className =
            "cgpt-checkbox";

        checkbox.style.marginRight = "8px";

        checkbox.addEventListener(
            "change",
            async () => {
                await updateSelectedChats(
                    link.href,
                    checkbox.checked
                );
            }
        );

        link.parentElement?.prepend(
            checkbox
        );
    });
}

setInterval(injectCheckboxes, 3000);

console.log(
    "ChatGPT Project Manager Loaded"
);