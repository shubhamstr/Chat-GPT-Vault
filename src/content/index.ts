import { findChats } from '../utils/chatScanner'

function injectCheckboxes() {
    const chats = findChats()

    chats.forEach((chat) => {
        if (
            chat.parentElement?.querySelector(
                '.cgpt-checkbox'
            )
        )
            return

        const checkbox =
            document.createElement('input')

        checkbox.type = 'checkbox'
        checkbox.className =
            'cgpt-checkbox'

        chat.parentElement?.prepend(
            checkbox
        )

        checkbox.addEventListener(
            'change',
            async () => {
                const result =
                    await chrome.storage.local.get(
                        'selectedChats'
                    )

                const selected =
                    result.selectedChats || []

                const id = (
                    chat as HTMLAnchorElement
                ).href

                if (checkbox.checked) {
                    selected.push(id)
                } else {
                    const index =
                        selected.indexOf(id)

                    if (index > -1) {
                        selected.splice(index, 1)
                    }
                }

                await chrome.storage.local.set({
                    selectedChats: selected,
                })
            }
        )
    })
}

setInterval(injectCheckboxes, 3000)

console.log(
    'ChatGPT Project Manager Loaded'
)