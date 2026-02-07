const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load text generation model
let generator;

async function loadModel() {
  // This is a very small keyless text generation model
  // optimized for browser use
  generator = await window.transformers.AutoModelForCausalLM.from_pretrained(
    "Xenova/tiny‑gpt2‑distilled",
    { quantized: true } // smaller
  );
}
loadModel();

async function generateText(prompt) {
  if (!generator) return "AI still loading model… please wait.";
  const output = await generator.generate(prompt, {
    max_new_tokens: 50,
    temperature: 0.7
  });
  return output.generated_text || "I don't know what to say yet.";
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // show typing indicator
  const typing = document.createElement("div");
  typing.className = "message ai";
  typing.textContent = "AI is thinking…";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  // get AI reply
  const reply = await generateText(text);

  typing.textContent = `AI: ${reply}`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});