const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// ⚠️ Use your OpenAI API key here (Local only)
const API_KEY = "PASTE_YOUR_API_KEY_HERE";

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user');
  userMsg.textContent = `You: ${text}`;
  chatBox.appendChild(userMsg);

  // Clear input
  input.value = '';

  // Call OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful AI." },
        { role: "user", content: text }
      ]
    })
  });

  const data = await response.json();
  const aiText = data.choices[0].message.content;

  // Show AI message
  const aiMsg = document.createElement('div');
  aiMsg.classList.add('message', 'ai');
  aiMsg.textContent = `AI: ${aiText}`;
  chatBox.appendChild(aiMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });