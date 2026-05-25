document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load existing key
  const { witApiKey } = await chrome.storage.local.get('witApiKey');
  if (witApiKey) {
    apiKeyInput.value = witApiKey;
  }

  // Save new key
  saveBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
      statusDiv.textContent = 'API Key tidak boleh kosong!';
      statusDiv.style.color = '#d93025';
      statusDiv.classList.remove('hidden');
      return;
    }

    await chrome.storage.local.set({ witApiKey: key });
    
    statusDiv.textContent = 'Tersimpan!';
    statusDiv.style.color = '#0f9d58';
    statusDiv.classList.remove('hidden');
    
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 2000);
  });
});
