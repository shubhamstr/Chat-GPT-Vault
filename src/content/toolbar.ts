export function createToolbar() {
    const toolbar =
        document.createElement("div");

    toolbar.id =
        "chatgpt-workspace-toolbar";

    toolbar.innerHTML = `
    <button id="copy-md">
      Copy MD
    </button>

    <button id="download-md">
      Download MD
    </button>

    <button id="save-note">
      Save Note
    </button>
  `;

    toolbar.style.position =
        "fixed";

    toolbar.style.bottom = "20px";

    toolbar.style.right = "20px";

    toolbar.style.zIndex = "99999";

    toolbar.style.background =
        "white";

    toolbar.style.padding = "10px";

    toolbar.style.border =
        "1px solid #ddd";

    document.body.appendChild(
        toolbar
    );

    return toolbar;
}