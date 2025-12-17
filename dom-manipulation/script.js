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
    const
