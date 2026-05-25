// Delay helper to mimic human behavior
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForElement(selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await sleep(250);
  }
  return null;
}

async function handleAnchorFrame() {
  console.log("Auto-Solve reCAPTCHA: Anchor frame detected");
  const checkbox = await waitForElement('.recaptcha-checkbox-checkmark');
  
  if (checkbox) {
    // Check if it's already checked
    const isChecked = document.querySelector('.recaptcha-checkbox[aria-checked="true"]');
    if (!isChecked) {
      console.log("Auto-Solve reCAPTCHA: Clicking checkbox");
      await sleep(1000 + Math.random() * 500); // Random delay
      checkbox.click();
    }
  }
}

async function handleBframe() {
  console.log("Auto-Solve reCAPTCHA: Challenge frame detected");
  
  // Wait to see what kind of challenge it is
  const audioButton = await waitForElement('#recaptcha-audio-button', 5000);
  
  if (audioButton) {
    // It's a visual challenge, switch to audio
    // Make sure it's visible
    const isAudioView = document.querySelector('.rc-audiochallenge-instructions');
    if (!isAudioView) {
      console.log("Auto-Solve reCAPTCHA: Switching to Audio Challenge");
      await sleep(1000 + Math.random() * 500);
      audioButton.click();
    }
  }

  // Now we wait for the audio download link
  const audioLink = await waitForElement('.rc-audiochallenge-tdownload-link');
  if (audioLink) {
    console.log("Auto-Solve reCAPTCHA: Audio link found", audioLink.href);
    
    // Check if we already solved it to prevent loop
    if (document.querySelector('#audio-response').value) {
      return;
    }

    await sleep(1500); // Wait a bit before requesting

    chrome.runtime.sendMessage({
      action: "transcribeAudio",
      audioUrl: audioLink.href
    }, async (response) => {
      if (chrome.runtime.lastError) {
        console.error("Auto-Solve reCAPTCHA:", chrome.runtime.lastError.message);
        return;
      }

      if (response && response.success) {
        console.log("Auto-Solve reCAPTCHA: Transcription successful:", response.text);
        const input = document.querySelector('#audio-response');
        if (input) {
          // Simulate typing
          input.value = response.text;
          
          await sleep(1000 + Math.random() * 1000); // Delay before verify
          const verifyButton = document.querySelector('#recaptcha-verify-button');
          if (verifyButton) {
            console.log("Auto-Solve reCAPTCHA: Clicking Verify");
            verifyButton.click();
          }
        }
      } else {
        console.error("Auto-Solve reCAPTCHA: Failed transcription", response?.error);
        // Optional: reload the audio challenge if it failed
        const reloadBtn = document.querySelector('#recaptcha-reload-button');
        if (reloadBtn) {
          await sleep(2000);
          reloadBtn.click();
        }
      }
    });
  }
}

// Determine which frame we are in
const currentUrl = window.location.href;
if (currentUrl.includes("/api2/anchor")) {
  handleAnchorFrame();
} else if (currentUrl.includes("/api2/bframe")) {
  handleBframe();
}
