const displayResult = document.getElementById("display");
const display = document.getElementById("input");
const historyBox = document.getElementById("history");
const historyEntries = document.getElementById("history-entries");
const clearHistoryBtn = document.querySelector(".clear-history");
const angleMode=document.querySelector('input[name="angleMode"]:checked');

let history = [];


function append(value) {
  display.textContent += value;
}

function clearDisplay() {
  display.textContent = "";
  displayResult.textContent = "0";
}

function deleteLast() {
  const currentValue = display.textContent;
  display.textContent = currentValue.slice(0, -1);
}
