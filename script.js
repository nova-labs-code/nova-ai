const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// We'll load a small GPT-2 model that works in the browser
let generator;

// Load model
async function loadModel() {
  chatBox.innerHTML += `<div class="message ai">AI: Loading model...</div>`;

  generator = await window.transformers.AutoModelForCausalLM.from_pretrained(
    "Xenova/gpt2‑small‑web", // <-- model that actually loads
    { quantized: true }
  );

  chatBox.innerHTML += `<div class="message ai">AI: Model loaded!</div>`;
}

loadModel();

async function generateText(prompt) {
  if (!generator) return "Still loading model…";

  const out = await generator.generate(prompt, {
    max_new_tokens: 50,
    temperature: 0.7,
  });

  // Some models return { generated_text } or replies array
  return out.generated_text || "…";
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const aiMessage = document.createElement("div");
  aiMessage.className = "message ai";
  aiMessage.textContent = "AI is thinking…";
  chatBox.appendChild(aiMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  const reply = await generateText(text);

  aiMessage.textContent = `AI: ${reply}`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});