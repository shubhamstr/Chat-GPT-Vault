import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
    manifest_version: 3,
    name: "ChatGPT Vault",
    version: "0.0.1",

    permissions: ["storage"],

    host_permissions: [
        "https://chatgpt.com/*"
    ],

    action: {
        default_popup: "popup.html"
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