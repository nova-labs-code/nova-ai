const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Use your Render backend URL here
const BACKEND_URL = "https://nova-ai-backend-578r.onrender.com/api/chat";

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="message ai">Nova AI: ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `<div class="message ai">Error: Cannot reach Nova AI backend</div>`;
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });