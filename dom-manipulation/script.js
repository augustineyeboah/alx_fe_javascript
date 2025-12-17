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
