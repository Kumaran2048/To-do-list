document.addEventListener('DOMContentLoaded', () => {
  const crypto = new SecureChatCrypto();
  
  // DOM Elements
  const elements = {
      keyStatus: document.getElementById('keyStatus'),
      keyArea: document.getElementById('keyArea'),
      peerPublicKey: document.getElementById('peerPublicKey'),
      peerKeyStatus: document.getElementById('peerKeyStatus'),
      messageContainer: document.getElementById('messageContainer'),
      messageInput: document.getElementById('messageInput'),
      generateKeysBtn: document.getElementById('generateKeys'),
      exportKeysBtn: document.getElementById('exportKeys'),
      sendMessageBtn: document.getElementById('sendMessage')
  };

  // Event Listeners
  elements.generateKeysBtn.addEventListener('click', generateKeys);
  elements.exportKeysBtn.addEventListener('click', exportKeys);
  elements.sendMessageBtn.addEventListener('click', sendMessage);
  elements.peerPublicKey.addEventListener('change', importPeerKey);
  
  // Allow sending with Enter key
  elements.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
      }
  });

  // Core Functions
  async function generateKeys() {
      try {
          elements.keyArea.value = "Generating keys...";
          await crypto.generateKeys();
          updateKeyStatus();
          addMessage("🔐 Encryption keys generated successfully!", "system");
          animateButton(elements.generateKeysBtn);
      } catch (error) {
          addMessage(`❌ Error generating keys: ${error.message}`, "error");
      }
  }

  async function exportKeys() {
      try {
          const publicKey = await crypto.exportPublicKey();
          elements.keyArea.value = JSON.stringify(publicKey, null, 2);
          addMessage("📤 Public key exported - Share this with your peer", "system");
          animateButton(elements.exportKeysBtn);
      } catch (error) {
          addMessage(`❌ Error exporting key: ${error.message}`, "error");
      }
  }

  async function importPeerKey() {
      try {
          const publicKeyJwk = JSON.parse(elements.peerPublicKey.value);
          await crypto.importPeerPublicKey(publicKeyJwk);
          elements.peerKeyStatus.textContent = "✅ Key imported successfully";
          elements.peerKeyStatus.className = "peer-key-status success";
          addMessage("🔑 Peer's public key imported", "system");
      } catch (error) {
          elements.peerKeyStatus.textContent = "❌ Invalid key format";
          elements.peerKeyStatus.className = "peer-key-status error";
      }
  }

  async function sendMessage() {
      const message = elements.messageInput.value.trim();
      if (!message) return;

      try {
          const encrypted = await crypto.encryptMessage(message);
          addMessage(`You: ${message}`, "sent");
          
          // In a real app, you would send the encrypted message to the peer
          // For demo, we'll simulate receiving and decrypting it
          setTimeout(async () => {
              try {
                  const decrypted = await crypto.decryptMessage(encrypted);
                  addMessage(`Friend: ${decrypted}`, "received");
              } catch (error) {
                  addMessage(`❌ Decryption failed: ${error.message}`, "error");
              }
          }, 1000 + Math.random() * 1000);

          elements.messageInput.value = '';
          animateButton(elements.sendMessageBtn);
      } catch (error) {
          addMessage(`❌ Error sending message: ${error.message}`, "error");
      }
  }

  // Helper Functions
  function addMessage(text, type) {
      const message = document.createElement('div');
      message.className = `message ${type}`;
      message.textContent = text;
      elements.messageContainer.appendChild(message);
      elements.messageContainer.scrollTop = elements.messageContainer.scrollHeight;
  }

  function updateKeyStatus() {
      elements.keyStatus.textContent = "🔑 Keys: Generated";
      elements.keyStatus.style.color = "#4CAF50";
  }

  function animateButton(button) {
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 300);
  }

  // Initial message
  addMessage("Welcome to Secure 3D Chat! Generate keys to begin.", "system");
});