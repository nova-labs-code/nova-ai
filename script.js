const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Knowledge points storage
let knowledgePoints = {}; // { topic: info }

async function scrapeDuckDuckGo(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`);
    const data = await res.json();
    return data.AbstractText || "I found no info online.";
  } catch (err) {
    return "I couldn't access online info.";
  }
}

async function generateReply(userMessage) {
  // Check if AI already knows about it
  const topic = userMessage.toLowerCase();
  if (knowledgePoints[topic]) {
    return knowledgePoints[topic]; // use stored info
  }

  // Otherwise, scrape online and store as points
  const scrapedInfo = await scrapeDuckDuckGo(topic);
  knowledgePoints[topic] = scrapedInfo; // gain points
  return scrapedInfo;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  const reply = await generateReply(text);
  chatBox.innerHTML += `<div class="message ai">AI: ${reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });