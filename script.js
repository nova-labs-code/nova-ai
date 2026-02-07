const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Function to fetch page content from your site
async function fetchSite(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  }
}

// Function to find relevant recipe info
function extractRecipe(html, query) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Look for titles, headings, or ingredients containing the query
  const matches = [];
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5");
  headings.forEach(h => {
    if (h.textContent.toLowerCase().includes(query.toLowerCase())) {
      // grab next sibling paragraphs
      let info = "";
      let next = h.nextElementSibling;
      while(next && next.tagName.toLowerCase() === "p") {
        info += next.textContent + "\n";
        next = next.nextElementSibling;
      }
      matches.push(`${h.textContent}:\n${info}`);
    }
  });

  return matches.length ? matches.join("\n\n") : "Sorry, no matching recipe found.";
}

// Handle user input
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `<div class="message user">You: ${text}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.textContent = "Searching recipes...";
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Fetch your site and search for the query
  const html = await fetchSite("https://samson-recipes.neocities.org/");
  let reply = "I couldn't access the site.";
  if (html) reply = extractRecipe(html, text);

  botDiv.textContent = reply;
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });