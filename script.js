const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Predefined responses
const responses = {
  hello: "Hello there! How can I help you?",
  bye: "Goodbye! Have a great day!",
  help: "I can answer simple questions. Try saying 'hello' or 'bye'."
};

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user');
  userMsg.textContent = text;
  chatBox.appendChild(userMsg);

  // Generate AI response
  const aiMsg = document.createElement('div');
  aiMsg.classList.add('message', 'ai');

  let found = false;
  for (let key in responses) {
    if (text.toLowerCase().includes(key)) {
      aiMsg.textContent = responses[key];
      found = true;
      break;
    }
  }
  if (!found) aiMsg.textContent = "I'm not sure how to respond to that.";

  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;
  userInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});