const botChatBox = document.getElementById("bot-chat-box");
const botInput = document.getElementById("bot-input");
const botSend = document.getElementById("bot-send");

let recipesList = [];

// Utility to display messages
function displayMessage(msg, type="bot") {
    const div = document.createElement("div");
    div.className = type === "bot" ? "bot-message" : "user-message";
    div.textContent = msg;
    botChatBox.appendChild(div);
    botChatBox.scrollTop = botChatBox.scrollHeight;
}

// Fetch recipes dynamically from homepage
async function fetchRecipes() {
    try {
        const res = await fetch("https://samson-recipes.neocities.org/");
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const recipeItems = doc.querySelectorAll(".recipe-item a, #recipes-container a");
        recipeItems.forEach(item => {
            const name = item.textContent.trim();
            const url = item.getAttribute("href") || "";
            let category = "", difficulty = "";
            const meta = item.parentElement.querySelector(".recipe-meta");
            if(meta) {
                const metaText = meta.textContent.toLowerCase();
                const catMatch = metaText.match(/category:\s*([a-z]+)/);
                const diffMatch = metaText.match(/difficulty:\s*([a-z]+)/);
                if(catMatch) category = catMatch[1];
                if(diffMatch) difficulty = diffMatch[1];
            }
            recipesList.push({name, url, category, difficulty, content:"", image:""});
        });

        // Preload content for each recipe
        for(let recipe of recipesList) {
            if(recipe.url) {
                try {
                    const res = await fetch(`https://samson-recipes.neocities.org/${recipe.url}`);
                    const text = await res.text();
                    const doc = new DOMParser().parseFromString(text,"text/html");
                    const ingredients = Array.from(doc.querySelectorAll("ul")).map(u=>u.textContent).join(" ");
                    const instructions = Array.from(doc.querySelectorAll("ol")).map(o=>o.textContent).join(" ");
                    recipe.content = ingredients + " " + instructions;
                    const imgTag = doc.querySelector("img");
                    if(imgTag) recipe.image = imgTag.getAttribute("src") || "";
                } catch(e) {
                    console.log("Failed to fetch page:", recipe.url);
                }
            }
        }

        displayMessage(`Bot: Loaded ${recipesList.length} recipes from homepage.`);
    } catch(err) {
        displayMessage("Bot: Failed to load recipes from homepage.");
        console.error(err);
    }
}

// Search recipes by query
function searchRecipes(query) {
    query = query.toLowerCase().trim();
    if(query.includes("what recipes") || query.includes("all recipes") || query.includes("list recipes")) {
        return recipesList;
    }
    return recipesList.filter(r => r.name.toLowerCase().includes(query) || r.content.toLowerCase().includes(query));
}

// Handle user query
function sendBotMessage() {
    const query = botInput.value.trim();
    if(!query) return;
    displayMessage(`You: ${query}`, "user");
    botInput.value = "";
    displayMessage("Bot: Searching...");

    setTimeout(()=>{
        const results = searchRecipes(query);
        if(results.length === 0){
            displayMessage("Bot: Sorry, no recipes found.");
            return;
        }
        results.forEach(r => {
            let msg = `Bot: ${r.name}\nCategory: ${r.category}\nDifficulty: ${r.difficulty}\n${r.content.substring(0,300)}...`;
            if(r.image) msg += `\nImage: ${r.image}`;
            displayMessage(msg);
        });
    }, 200);
}

// Event listeners
botSend.addEventListener("click", sendBotMessage);
botInput.addEventListener("keypress", e => { if(e.key === "Enter") sendBotMessage(); });

// Start fetching recipes
fetchRecipes();