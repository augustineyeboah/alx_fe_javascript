// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Learning never exhausts the mind.", category: "Education" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Motivation" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Explicit Math.random usage
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// ----------------------------
// REQUIRED: populateCategories
// ----------------------------
function populateCategories() {
  // Use map to extract categories
  const categories = quotes.map(quote => quote.category);
  
  // Remove duplicates
  const uniqueCategories = [...new Set(categories)];

  // Clear previous options
  categoryFilter.innerHTML = "";

  // Add "All Categories" option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(al
