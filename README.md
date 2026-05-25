# DesCaptcha (reCAPTCHA Auto-Solver)

Browser extension to automatically solve/bypass Google reCAPTCHA's audio challenge using Wit.ai's Speech-to-Text API. It runs seamlessly in the background and is fully compatible with Incognito/Private Mode.

## Security & Privacy (How It Works)

**Is this extension safe? Will it steal my data?**
Yes, it is completely safe. The extension can "click" on elements in your browser, but its access is strictly restricted by `manifest.json`.

- **Restricted Access:** In the `manifest.json`, the extension is only allowed to run its scripts on very specific URLs: `*://*.google.com/recaptcha/*` and `*://*.recaptcha.net/*`. It **cannot** read, see, or click anything on your banking sites, social media, or any other web pages you visit.
- **No Tracking:** It only downloads the reCAPTCHA audio file and sends it directly to the Wit.ai API endpoint. It does not send any of your personal data anywhere.
- **Your Own API Key:** You provide your own Wit.ai API Key. The extension stores this key locally in your browser. It is never synced to any external server (except when talking to Wit.ai to transcribe the audio).

## Installation

### Firefox
You can install DesCaptcha directly from the official Firefox Add-ons Store. Once installed, it will automatically update whenever there is a new version.
*(Store Link: Coming soon / Search "DesCaptcha" in Firefox Add-ons)*

### Google Chrome / Brave / Edge (Manual Installation)
Since the extension uses standard Manifest V3, you can easily load it into Chromium browsers manually:
1. Open Chrome / Brave / Edge and navigate to `chrome://extensions` (or `brave://extensions`).
2. Enable **Developer mode** in the top right corner.
3. Click the **Load unpacked** button in the top left.
4. Select the directory containing this project.
5. (Optional) To use in Incognito, click "Details" on the extension and turn on **Allow in Incognito**.

## Setup

You will need a free API key from Wit.ai:
1. Go to [Wit.ai](https://wit.ai/) and log in.
2. Create a new App.
3. Go to **Settings > Management** and copy your **Server Access Token**.
4. Click the extension icon in your browser toolbar.
5. Paste your token and click **Simpan**.

## Usage

When you encounter a reCAPTCHA challenge, the extension will automatically:
1. Click the "I'm not a robot" checkbox.
2. Switch to the Audio Challenge (if a visual puzzle appears).
3. Download the audio file and send it to Wit.ai.
4. Type the transcribed text into the answer box and click "Verify".

Sit back and let it bypass the CAPTCHAs for you!
