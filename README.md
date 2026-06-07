# ⚡ ChatGPT Vault

**ChatGPT Vault** is a high-performance, developer-friendly Chrome extension that helps you save, search, and manage your ChatGPT interactions. Effortlessly capture prompts and assistant responses as structured notes, manage them with dynamic tags, and quickly copy code/markdown or plain text.

🛍️ **[Chrome Web Store](https://chromewebstore.google.com/detail/ncnaomcidbflhinafcnclklcilmidmhf/preview)** | 🔒 **[Privacy Policy](https://shubhamstr.github.io/Chat-GPT-Vault/)**

---

## 🚀 Features

- **Injected Action Buttons**: Adds native-looking "Save Prompt", "Save Note", "Copy", and "Copy Markdown" buttons right inside the ChatGPT interface.
- **Sleek Popup Dashboard**: View and filter saved items by title, contents, or custom tags.
- **Markdown-Ready Clipboard**: Instantly format and copy assistant messages. You can use [Markdown Live Preview](https://markdownlivepreview.com/) to preview, edit, and render your copied markdown content.
- **Offline Storage**: Securely saves data on your device using Chrome's `chrome.storage.local` API.

---

## 🛠️ Local Development & Build Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone this repository to your local machine.
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running the Dev Server
To start the Vite developer server with hot reloading (HMR) for popups and options:
```bash
npm run dev
```

### Production Build
To build the extension for production (compiles TypeScript, bundles assets, and generates the manifest):
```bash
npm run build
```
This command generates the built files in the `dist` folder.

---

## 🧪 Testing the Extension (Local Loading)

To load and test **ChatGPT Vault** in your Chrome browser:

1. Run the build script in your terminal to generate the `dist` directory:
   ```bash
   npm run build
   ```
2. Open Google Chrome and navigate to the extensions page by typing:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** using the toggle switch in the top-right corner of the page.
4. Click on the **Load unpacked** button in the top-left corner.
5. In the file explorer, navigate to your project directory and select the **`dist`** folder.
6. **ChatGPT Vault** is now loaded! Pin it from the extensions menu for easy access.
7. Open [ChatGPT](https://chatgpt.com) in a tab and verify that the helper buttons appear beneath messages.

---

## 📦 Deploying to the Chrome Web Store

To publish the extension to the Chrome Web Store:

1. **Build the Production Bundle**:
   Ensure you have run `npm run build` to compile the latest version of the code.
2. **Zip the Assets**:
   Compress the contents of the generated `dist` folder into a `.zip` archive (e.g., `chatgpt-vault.zip`). Ensure that `manifest.json` is at the root of the ZIP file structure.
3. **Register as a Developer**:
   Go to the [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/) and sign in with a Google Account. Complete the developer registration process (requires a small one-time fee).
4. **Create a New Item**:
   - Click the **+ New Item** button.
   - Upload your `chatgpt-vault.zip` file.
5. **Fill out the Listing Details**:
   - Provide a description of ChatGPT Vault.
   - Upload extension screenshots, an icon (128x128), and select category/privacy policies.
6. **Submit for Review**:
   Click **Submit for review**. Chrome Web Store moderators will review your extension, and it will be published once approved (usually takes 1-3 days).
