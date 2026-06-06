export async function savePrompt(
    prompt: unknown
) {
    const result =
        await chrome.storage.local.get(
            "prompts"
        );

    const prompts: unknown[] =
        (result.prompts as unknown[]) ||
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
        (result.prompts as unknown[]) ||
        []
    );
}