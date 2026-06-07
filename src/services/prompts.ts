export interface PromptItem {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export async function savePrompt(
    prompt: PromptItem
) {
    const result =
        await chrome.storage.local.get(
            "prompts"
        );

    const prompts: PromptItem[] =
        (result.prompts as PromptItem[]) ||
        [];

    prompts.push(prompt);

    await chrome.storage.local.set({
        prompts,
    });
}

export async function getPrompts() {
    const result =
        await chrome.storage.local.get(
            "prompts"
        );

    return (
        (result.prompts as PromptItem[]) ||
        []
    );
}