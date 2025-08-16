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

  const allowedFunctions = [
    "sin","cos","tan",
    "asin","acos","atan",
    "ln","log"
  ];

  const allowedConstants = ["e", "π"];

  const allowedWords = new Set([...allowedFunctions, ...allowedConstants]);

  const words = expr.match(/[A-Za-zπ]+/g) || [];
  for (const w of words) {
    if (!allowedWords.has(w)) return true; 
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

//expression evaluation

function evaluate(expr){
  const tokensbeforemap=tokenize(expr);
  const tokens=maptoken(tokensbeforemap);
  if(tokens[0]==="-") tokens.unshift("0");
  const postfixTokens = infixToPostfix(tokens);
  const result = evaluatePostfix(postfixTokens);
  return result;
}

function precedence(op){
  if(op==="+" || op==="-") return 1;
  if(op==="*" || op==="/") return 2;
  if(op==="power") return 3;
  if(op==="factorial" || op==="sqrt" || op==="sin" || op==="cos" || op==="tan" || op==="asin" || op==="acos" || op==="atan" || op==="sqrt" || op==="ln" || op==="log") return 4;
  return 0;
}
function tokenize(expr){
    const tokens = expr.match(
    /(\d+(\.\d+)?)|[+\-*/^%!√()]|sin|cos|tan|asin|acos|atan|ln|log|π|e/g);
    return tokens || [];
}

function maptoken(tokens){
    const mapping={
      '^': "power", '√':"sqrt",'π':3.14159265,'e':2.7182818, '!':"factorial"
    }
    for(let i=0;i<tokens.length;i++){
      if(tokens[i]==='^' || tokens[i]==='√' || tokens[i]==='π' || tokens[i]==='e' || tokens[i]==='!') 
        tokens[i]=mapping[tokens[i]];
      else continue;
    }
    return tokens;
}