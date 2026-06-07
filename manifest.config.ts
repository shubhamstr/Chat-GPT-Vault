import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
    manifest_version: 3,
    name: "ChatGPT Vault",
    version: "0.0.1",

    permissions: ["storage"],

    host_permissions: [
        "https://chatgpt.com/*"
    ],

    icons: {
        "16": "icon.png",
        "32": "icon.png",
        "48": "icon.png",
        "128": "icon.png"
    },

    action: {
        default_popup: "popup.html",
        default_icon: {
            "16": "icon.png",
            "32": "icon.png",
            "48": "icon.png",
            "128": "icon.png"
        }
    },

    background: {
        service_worker: "src/background/background.ts",
        type: "module"
    },

    content_scripts: [
        {
            matches: [
                "https://chatgpt.com/*"
            ],
            js: [
                "src/content/content.ts"
            ]
        }
    ]
};

export default manifest;