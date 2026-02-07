const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Memory system
let knowledgePoints = JSON.parse(localStorage.getItem('knowledgePoints') || "{}");

// Tiny AI fallback replies
const genericReplies = [
  "Interesting, tell me more!",
  "Hmm, I need to learn more about that.",
  "Can you explain it differently?",
  "Let's figure this out together."
];

// Fetch info from Wikipedia keyless API
async function fetchWikipedia(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.extract || null;
  } catch {
    return null;
  }
}

// AI reply generator
async function generateReply(userMessage) {
  const topic = userMessage.toLowerCase();

  // Memory check first
  if (knowledgePoints[topic]) return knowledgePoints[topic];

  // Try Wikipedia scraping
  const wikiInfo = await fetchWikipedia(topic);
  if (wikiInfo) {
    knowledgePoints[topic] = wikiInfo;
    localStorage.setItem('knowledgePoints', JSON.stringify(knowledgePoints));
    return wikiInfo;
  }

  // Otherwise, fallback reply
  return genericReplies[Math.floor(Math.random() * genericReplies.length)];
}

// Send message
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI typing effect
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai';
  typingDiv.textContent = 'AI is thinking...';
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  const reply = await generateReply(text);
  typingDiv.textContent = `AI: ${reply}`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if(e.key === 'Enter') sendMessage(); });