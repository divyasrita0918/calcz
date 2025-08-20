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


function clearDisplay() {
  display.value = "";
  displayResult.textContent = "0";
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

function hasInvalidChars(expr) {
  return /[+\-*/]{2,}/.test(input) || /^[*/]/.test(input) || /[+\-*/]$/.test(input);
}


//expression evaluation

function evaluate(expr) {
  const tokens = tokenize(expr);
  if (tokens[0] === "-") tokens.unshift("0");
  const postfixTokens = infixToPostfix(tokens);
  const result = evaluatePostfix(postfixTokens);
  return result;
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

function tokenize(expression) {
  return expression.match(/\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g);
}

function applyOp(a, b, op) {
  a = Number(a);
  b = Number(b);
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
  }
}

function infixToPostfix(tokens) {
  const stack = [];
  const output = [];

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)
    ) {
      output.push(token);
    }

    else if (token === '(') {
      stack.push(token);
    }

    else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      stack.pop();
    }
    else {

      while (stack.length && precedence(stack[stack.length - 1]) >= precedence(token)) {
        output.push(stack.pop());
      }
      stack.push(token);
    }
  }

  while (stack.length) {
    output.push(stack.pop());
  }

  return output;
}

function evaluatePostfix(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)) {
      stack.push(token);
    }
    else {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(applyOp(a, b, token));
    }
  }

  return stack.pop();
}
