chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "transcribeAudio") {
    handleTranscription(request.audioUrl)
      .then(text => sendResponse({ success: true, text }))
      .catch(error => sendResponse({ success: false, error: error.toString() }));
    
    // Return true to indicate we will send a response asynchronously
    return true; 
  }
});

async function handleTranscription(audioUrl) {
  // 1. Get API Key from storage
  const { witApiKey } = await chrome.storage.local.get("witApiKey");
  if (!witApiKey) {
    throw new Error("API Key Wit.ai belum diset di pengaturan ekstensi.");
  }

  // 2. Fetch the audio file
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Gagal mengunduh audio: ${response.status} ${response.statusText}`);
  }
  const audioBlob = await response.blob();

  // 3. Send to Wit.ai Speech API
  const witResponse = await fetch("https://api.wit.ai/dictation", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${witApiKey}`,
      "Content-Type": "audio/mpeg3" // ReCAPTCHA usually sends MP3
    },
    body: audioBlob
  });

  if (!witResponse.ok) {
    throw new Error(`Wit.ai API Error: ${witResponse.status}`);
  }

  const resultText = await witResponse.text();
  
  // Wit.ai usually returns multiple JSON objects separated by \r\n
  // We need to parse the last one or find the one with is_final = true
  const parts = resultText.trim().split("\r\n");
  let transcribedText = "";

  for (let i = parts.length - 1; i >= 0; i--) {
    if (!parts[i]) continue;
    try {
      const data = JSON.parse(parts[i]);
      if (data.text) {
        transcribedText = data.text;
        break;
      }
    } catch (e) {
      console.error("Failed to parse Wit.ai response chunk", parts[i]);
    }
  }

  if (!transcribedText) {
    throw new Error("Wit.ai tidak bisa mengenali suara tersebut.");
  }

  return transcribedText;
}
