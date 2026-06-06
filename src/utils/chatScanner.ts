export function findChats() {
    return [
        ...document.querySelectorAll(
            'a[href*="/c/"]'
        ),
    ];
}