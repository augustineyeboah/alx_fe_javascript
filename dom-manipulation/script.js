// ----------------------------
// SERVER SYNC SIMULATION
// ----------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    // Simulate server quotes: take first 5
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    let conflicts = 0;

    serverQuotes.forEach(sq => {
      const exists = quotes.some(lq => lq.text === sq.text);
      if (!exists) {
        quotes.push(sq);
      } else {
        conflicts++;
      }
    });

    if (conflicts > 0) {
      console.log(`Resolved ${conflicts} conflicts. Server data takes precedence.`);
    }

    saveQuotes();
    populateCategories();
    filterQuote();
  } catch (err) {
    console.error("Failed to fetch server quotes", err);
  }
}

// Sync every 15 seconds
setInterval(fetchQuotesFromServer, 15000);
fetchQuotesFromServer(); // initial fetch
