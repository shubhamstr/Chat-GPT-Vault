import { injectWorkspaceButtons } from "./injectButtons";

const STYLE_ID = "chatgpt-workspace-content-styles";

function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        .chatgpt-workspace-btn-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
            padding: 8px 0;
            border-top: 1px dashed rgba(0, 0, 0, 0.08);
            width: 100%;
        }
        .dark .chatgpt-workspace-btn-container {
            border-top-color: rgba(255, 255, 255, 0.08);
        }
        .chatgpt-workspace-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(0, 0, 0, 0.08);
            color: #4b5563;
            border-radius: 8px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }
        .dark .chatgpt-workspace-btn {
            background-color: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
            color: #d1d5db;
        }
        .chatgpt-workspace-btn:hover {
            background-color: rgba(0, 0, 0, 0.08);
            border-color: rgba(0, 0, 0, 0.15);
            color: #111827;
            transform: translateY(-1px);
        }
        .dark .chatgpt-workspace-btn:hover {
            background-color: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            transform: translateY(-1px);
        }
        .chatgpt-workspace-btn:active {
            transform: translateY(0);
        }
        .chatgpt-workspace-btn svg {
            color: inherit;
            flex-shrink: 0;
        }
    `;
    document.head.appendChild(style);
}

function scanAndInject() {
    const selector = '[data-message-author-role="user"], [data-message-author-role="assistant"]';
    const messages = document.querySelectorAll(selector);
    messages.forEach((msg) => {
        if (msg instanceof HTMLElement) {
            injectWorkspaceButtons(msg);
        }
    });
}

function init() {
    injectStyles();
    
    // Initial scan
    scanAndInject();

    // Create mutation observer to listen to dynamic DOM changes (new messages)
    const observer = new MutationObserver((mutations) => {
        let hasNewMessages = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                hasNewMessages = true;
                break;
            }
        }
        if (hasNewMessages) {
            scanAndInject();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Run initial scripts
if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}

