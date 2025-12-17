// Local quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" }
];

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote (simple)
function showRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  document.getElementById("quoteDisplay").innerHTML = `<p>"${quote.text}"</p><small>Category: ${quote.category}</small>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------------
// SERVER SYNC SIMULATION
// ----------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// GET quotes from server and resolve conflicts (server takes precedence)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    const serverQuotes = data.slice(0,5).map(item => ({ text: item.title, category: "Server" }));

    let conflicts = 0;

    serverQuotes.forEach(sq => {
      const exists = quotes.some(lq => lq.text === sq.text);
      if (!exists) {
        quotes.push(sq);
      } else {
        conflicts++;
      }
    });

    if (conflicts > 0) console.log(`Resolved ${conflicts} conflicts.`);

    saveQuotes();
    showRandomQuote();
  } catch (err) {
    console.error("Failed to fetch server quotes", err);
  }
}

// POST local quotes to server
async function syncQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });
    console.log("Synced to server");
  } catch (err) {
    console.error("Failed to sync to server", err);
  }
}

// ----------------------------
// Set intervals for automatic sync
// ----------------------------
setInterval(fetchQuotesFromServer, 15000); // fetch every 15s
setInterval(syncQuotesToServer, 30000);    // post every 30s

// ----------------------------
// Event listeners
// ----------------------------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial display and sync
showRandomQuote();
fetchQuotesFromServer();
syncQuotesToServer();
