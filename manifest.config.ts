import { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
    manifest_version: 3,

    name: "ChatGPT Project Manager",

    version: "0.0.1",

    icons: {
        16: "icon.png",
        48: "icon.png",
        128: "icon.png",
    },

    permissions: [
        "storage"
    ],

    host_permissions: [
        "https://chatgpt.com/*"
    ],

    background: {
        service_worker: "src/background/index.ts",
        type: "module",
    },

    action: {
        default_popup: "popup.html",
    },

    content_scripts: [
        {
            matches: [
                "https://chatgpt.com/*"
            ],
            js: [
                "src/content/index.ts"
            ],
        },
    ],
};

export default manifest;