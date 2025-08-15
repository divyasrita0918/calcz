const displayResult = document.getElementById("display");
const display = document.getElementById("input");
const historyBox = document.getElementById("history");
const historyEntries = document.getElementById("history-entries");
const clearHistoryBtn = document.querySelector(".clear-history");


let history = [];


function append(value) {
  display.value += value;
}

function calculate() {
  const angleMode=document.querySelector('input[name="angleMode"]:checked');
  const expr = display.value;
  if (!expr.trim()) return;
  if (hasInvalidChars(expr)) {
    displayResult.textContent = "Invalid";
    return;
  }
  try {
    const result = evaluate(expr);
    displayResult.textContent = result;
    addToHistory(expr, result);
    display.value = "";
  } catch {
    displayResult.textContent = "Error";
  }
}

function hasInvalidChars(expr) {
    const validChars = /^[0-9+\-*/^%!().√πe\sA-Za-z]*$/;
  if (!validChars.test(expr)) return true;

  const allowedFunctions = ["sin","cos","tan","asin","acos","atan","ln","log"];
  const matches = expr.match(/[A-Za-z]+/g) || [];
  for (let fn of matches) {
    if (!allowedFunctions.includes(fn)) return true;
  }

  return false;
}

function toggleHistory() {
  if (historyBox.style.display === "flex") {
    historyBox.style.display = "none";
    clearHistoryBtn.style.display = "none";
  } else {
    historyBox.style.display = "flex";
    clearHistoryBtn.style.display = "inline-block";
  }
}

function addToHistory(expression, result) {
  const entry = `${expression} = ${result}`;
  history.push(entry);
  const p = document.createElement("p");
  p.textContent = entry;
  historyEntries.appendChild(p);
}


function clearHistory() {
  history = [];
  historyEntries.innerHTML = "";
  clearHistoryBtn.style.display = "none"; 
  historyBox.style.display = "none";      
}

function deleteLast() {
  const currentValue = display.value;
  display.value = currentValue.slice(0, -1);
}

function clearDisplay() {
  display.value = "";
  displayResult.textContent = "0";
}
