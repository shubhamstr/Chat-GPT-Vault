export async function copyText(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}

export async function copyMarkdown(markdown: string): Promise<void> {
    await navigator.clipboard.writeText(markdown);
}
