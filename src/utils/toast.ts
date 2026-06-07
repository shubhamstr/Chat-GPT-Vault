interface ToastOptions {
    type?: "success" | "error" | "info";
    duration?: number;
    interactive?: boolean;
    defaultTitle?: string;
    defaultTags?: string[];
    onSave?: (title: string, tags: string[]) => void;
}

// Inject styling once
const STYLE_ID = "chatgpt-workspace-toast-styles";
function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        .cw-toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 10000000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .cw-toast {
            background: rgba(32, 33, 35, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #f1f1f1;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-width: 320px;
            max-width: 380px;
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cw-toast.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .cw-toast-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 14px;
        }
        .cw-toast-body {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .cw-toast-input-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .cw-toast-label {
            font-size: 11px;
            color: #a3a3a3;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .cw-toast-input {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #fff;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
        }
        .cw-toast-input:focus {
            border-color: #10a37f;
            background: rgba(255, 255, 255, 0.12);
        }
        .cw-toast-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 4px;
        }
        .cw-toast-btn {
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        .cw-toast-btn:hover {
            background: #1a7f64;
        }
        .cw-toast-btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e3e3e3;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .cw-toast-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        /* Light mode support */
        html:not(.dark) .cw-toast {
            background: rgba(255, 255, 255, 0.98);
            color: #1f2937;
            border: 1px solid rgba(0, 0, 0, 0.12);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        html:not(.dark) .cw-toast-input {
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.12);
            color: #1f2937;
        }
        html:not(.dark) .cw-toast-input:focus {
            border-color: #10a37f;
            background: rgba(0, 0, 0, 0.08);
        }
        html:not(.dark) .cw-toast-label {
            color: #6b7280;
        }
        html:not(.dark) .cw-toast-btn-secondary {
            background: rgba(0, 0, 0, 0.05);
            color: #4b5563;
        }
        html:not(.dark) .cw-toast-btn-secondary:hover {
            background: rgba(0, 0, 0, 0.08);
        }
    `;
    document.head.appendChild(style);
}

export function showToast(message: string, options: ToastOptions = {}) {
    if (typeof document === "undefined") return;

    injectStyles();

    // Find or create container
    let container = document.querySelector(".cw-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "cw-toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "cw-toast";

    const {
        type = "success",
        duration = 3500,
        interactive = false,
        defaultTitle = "",
        defaultTags = [],
        onSave,
    } = options;

    let icon = "💡";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";

    // Setup basic content
    let htmlContent = `
        <div class="cw-toast-header">
            <span>${icon}</span>
            <span>${message}</span>
        </div>
    `;

    if (interactive) {
        htmlContent += `
            <div class="cw-toast-body">
                <div class="cw-toast-input-group">
                    <label class="cw-toast-label">Title</label>
                    <input type="text" class="cw-toast-input cw-title-input" value="${defaultTitle.replace(/"/g, "&quot;")}">
                </div>
                <div class="cw-toast-input-group">
                    <label class="cw-toast-label">Tags (comma separated)</label>
                    <input type="text" class="cw-toast-input cw-tags-input" value="${defaultTags.join(", ")}" placeholder="e.g. tutorial, python">
                </div>
                <div class="cw-toast-actions">
                    <button class="cw-toast-btn-secondary cw-close-btn">Dismiss</button>
                    <button class="cw-toast-btn cw-save-btn">Done</button>
                </div>
            </div>
        `;
    }

    toast.innerHTML = htmlContent;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 10);

    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    const dismiss = () => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => {
            toast.remove();
            if (container && container.childNodes.length === 0) {
                container.remove();
            }
        });
    };

    if (interactive && onSave) {
        const titleInput = toast.querySelector(".cw-title-input") as HTMLInputElement;
        const tagsInput = toast.querySelector(".cw-tags-input") as HTMLInputElement;
        const saveBtn = toast.querySelector(".cw-save-btn") as HTMLButtonElement;
        const closeBtn = toast.querySelector(".cw-close-btn") as HTMLButtonElement;

        const handleSave = () => {
            const finalTitle = titleInput.value.trim() || defaultTitle || "Untitled";
            const tagsList = tagsInput.value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);
            onSave(finalTitle, tagsList);
            dismiss();
        };

        saveBtn.addEventListener("click", handleSave);
        closeBtn.addEventListener("click", dismiss);

        // Save on Enter
        titleInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleSave();
        });
        tagsInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleSave();
        });

        // Set longer auto-dismiss duration for interactive, but let it auto-save default values if untouched
        fadeTimer = setTimeout(() => {
            handleSave();
        }, duration || 8000);
    } else {
        // Auto-dismiss for standard notification toasts
        fadeTimer = setTimeout(dismiss, duration);
    }

    // Pause timer on hover
    toast.addEventListener("mouseenter", () => {
        if (fadeTimer) {
            clearTimeout(fadeTimer);
            fadeTimer = null;
        }
    });

    toast.addEventListener("mouseleave", () => {
        if (!fadeTimer && !interactive) {
            fadeTimer = setTimeout(dismiss, duration);
        }
    });
}
