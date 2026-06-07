export function createToolbar() {
  const toolbar =
    document.createElement("div");

  toolbar.id = "cgpt-toolbar";

  toolbar.innerHTML = `
    <button id="copy-md">
      Copy MD
    </button>

    <button id="copy-text">
      Copy Text
    </button>

    <button id="save-note">
      Save Note
    </button>

    <button id="save-prompt">
      Save Prompt
    </button>
  `;

  Object.assign(toolbar.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    display: "flex",
    gap: "8px",
    padding: "10px",
    borderRadius: "12px",
    background: "#202123",
    boxShadow:
      "0 4px 16px rgba(0,0,0,.25)",
    zIndex: "999999",
  });

  toolbar
    .querySelectorAll("button")
    .forEach((btn) => {
      Object.assign(btn.style, {
        background: "#10a37f",
        border: "none",
        color: "white",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
      });
    });

  document.body.appendChild(
    toolbar
  );

  return toolbar;
}