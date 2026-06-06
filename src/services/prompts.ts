export async function savePrompt(
    prompt: any
) {
    const result =
        await chrome.storage.local.get(
            "prompts"
        );

    const prompts =
        result.prompts || [];

    prompts.push(prompt);

    await chrome.storage.local.set({
        prompts,
    });
}