// ----------------------------
// Local Quotes
// ----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Explicit Math.random usage
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// ----------------------------
// Populate Categories
// ----------------------------
function populateCategories() {
  const categories = quotes.map(q => q.category);
  const uniqueCategories = [...new Set(categories)];

  categoryFilter.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ----------------------------
// Filter Quote
// ----------------------------
function filterQuote() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = getRandomIndex(filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------------
// Show Random Quote
// ----------------------------
function showRandomQuote() {
  filterQuote();
}

// ----------------------------
// Add Quote Form
// ----------------------------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// ----------------------------
// Add New Quote
// ----------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuote();
}

// ----------------------------
// Export / Import JSON
// ----------------------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuote();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----------------------------
// SERVER SYNC SIMULATION
// ----------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API

async function fetchServerQuotes() {
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
setInterval(fetchServerQuotes, 15000);

// ----------------------------
// Event Listeners
// ----------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportToJsonFile);

// ----------------------------
// Initialize
// ----------------------------
createAddQuoteForm();
populateCategories();
filterQuote();
fetchServerQuotes();
