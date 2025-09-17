window.onload = function () {
  history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  displayHistory();
};


const displayResult = document.getElementById("display");
const display = document.getElementById("input");
const historyBox = document.getElementById("history");
const historyEntries = document.getElementById("history-entries");
const clearHistoryBtn = document.querySelector(".clear-history");

let history = [];

display.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); 
    calculate();
  }
});


function append(value) {
  display.value += value;
}

function calculate() {
  const angleMode = document.querySelector('input[name="angleMode"]:checked').value;
  let expr = display.value;
  if (!expr.trim()) return;
  let openBrackets = (expr.match(/\(/g) || []).length;
  let closeBrackets = (expr.match(/\)/g) || []).length;
  if (openBrackets > closeBrackets) {
    expr += ")".repeat(openBrackets - closeBrackets);
  }
  if (hasInvalidChars(expr)) {
    displayResult.textContent = "Invalid";
    return;
  }
  try {
    const result = evaluate(expr, angleMode);
    displayResult.textContent = result;
    addToHistory(expr, result);
    display.value = "";
  } catch {
    displayResult.textContent = "Error";
  }
}

function hasInvalidChars(expr) {
  if (!validChars.test(expr)) return true;

  const allowedWords = new Set([...allowedFunctions, ...allowedConstants]);

  const words = expr.match(/[A-Za-zπ]+/g) || [];
  for (const w of words) {
    if (!allowedWords.has(w)) return true;
  }
  return false;
}


function toggleHistory() {
  const overlay = document.getElementById("history-overlay");

  if (overlay.style.display === "flex") {
    overlay.style.display = "none";   
  } else {
    overlay.style.display = "flex";  
    displayHistory();                 
  }
}


function displayHistory() {
  historyEntries.innerHTML = ""; 

  history.forEach(entry => {
    const p = document.createElement("p");
    p.textContent = entry;
    historyEntries.appendChild(p);
  });
}


function addToHistory(expression, result) {
  const entry = `${expression} = ${result}`;
  history.push(entry);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  const p = document.createElement("p");
  p.textContent = entry;
  historyEntries.appendChild(p);
}


function ans() {
  if (history.length > 0) {
    const lastEntry = history[history.length - 1];
    const lastResult = lastEntry.split("=")[1].trim();
    display.value += lastResult;
  }
}


function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory"); 
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

function evaluate(expr, angleMode) {
  const tokensbeforemap = tokenize(expr);
  const tokens = maptoken(tokensbeforemap);
  const postfixTokens = infixToPostfix(tokens);
  const result = evaluatePostfix(postfixTokens, angleMode);
  return result;
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  if (op === "power") return 3;
  if (op === "factorial" || op === "sqrt" || op === "sin" || op === "cos" || op === "tan" || op === "asin" || op === "acos" || op === "atan" || op === "sqrt" || op === "ln" || op === "log" || op === "cbrt" || op === "percent") return 4;
  if (op === "u-" || op === "u+") return 5;
  return 0;
}
function tokenize(expr) {
  const tokens = expr.match(
    /(\d+(\.\d+)?)|[+\-*/^%!√∛()]|sin|cos|tan|asin|acos|atan|ln|log|π|e/g);
  return tokens || [];
}

function maptoken(tokens) {

  for (let i = 0; i < tokens.length; i++) {

    const token = tokens[i];
    if (token === '^' || token === '√' || token === 'π' || token === 'e' || token === '!' || token === '∛' || token === '%')
      tokens[i] = mapping[tokens[i]];

    else if (token === '-' && (i === 0 || ["+", "-", "*", "/", "^", "(", "power"].includes(tokens[i - 1])))
      tokens[i] = "u-";

    else if (token === '+' && (i === 0 || ["+", "-", "*", "/", "^", "("].includes(tokens[i - 1]))) {
      tokens.splice(i, 1);
      i--;
    }

    else continue;
  }
  return tokens;
}

function infixToPostfix(tokens) {
  const stack = [];
  const output = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (/^\d+(\.\d+)?$/.test(token)) {
      output.push(token);
    }

    else if (
      ["sin", "cos", "tan", "asin", "acos", "atan",
        "ln", "log", "sqrt", "factorial", "cbrt"].includes(token)
    ) {
      stack.push(token);
    }

    else if (token === "(") {
      stack.push(token);
    }

    else if (token === ")") {
      while (stack.length && stack[stack.length - 1] !== "(") {
        output.push(stack.pop());
      }
      stack.pop();

      if (stack.length &&
        ["sin", "cos", "tan", "asin", "acos", "atan",
          "ln", "log", "sqrt", "factorial", "u-", "cbrt"].includes(stack[stack.length - 1])) {
        output.push(stack.pop());
      }
    }

    else {
      while (
        stack.length &&
        precedence(stack[stack.length - 1]) >= precedence(token)
      ) {
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

function evaluatePostfix(tokens, angleMode) {
  const stack = [];

  for (const token of tokens) {
    if (/^\d+(\.\d+)?$/.test(token)) {

      stack.push(parseFloat(token));
    }
    else if (token === "u-") {

      const a = stack.pop();
      stack.push(-a);
    }

    else if (token === "factorial") {
      const a = stack.pop();
      if (a < 0 || !Number.isInteger(a)) throw "Invalid factorial";
      let res = 1;
      for (let i = 1; i <= a; i++) res *= i;
      stack.push(res);
    }
    else if (token === "sqrt") {
      const a = stack.pop();
      stack.push(sqrt(a));
    }
    else if (token === "cbrt") {
      const a = stack.pop();
      stack.push(cbrt(a));
    }

    else if (token === "percent") {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(a % b);
    }

    else if (["sin", "cos", "tan", "asin", "acos", "atan", "ln", "log"].includes(token)) {
      const a = parseFloat(stack.pop());

      switch (token) {
        case "sin":
          stack.push(sin(angleMode === "deg" ? toRadians(a) : a));
          break;
        case "cos":
          stack.push(cos(angleMode === "deg" ? toRadians(a) : a));
          break;
        case "tan":
          stack.push(tan(angleMode === "deg" ? toRadians(a) : a));
          break;

        case "asin":
          stack.push(angleMode === "deg" ? toDegrees(asin(a)) : asin(a));
          break;
        case "acos":
          stack.push(angleMode === "deg" ? toDegrees(acos(a)) : acos(a));
          break;
        case "atan":
          stack.push(angleMode === "deg" ? toDegrees(atan(a)) : atan(a));
          break;
        case "ln":
          stack.push(ln(a));
          break;
        case "log":
          stack.push(log(a));
          break;
      }

    }

    else {

      const b = parseFloat(stack.pop());
      const a = parseFloat(stack.pop());
      switch (token) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": stack.push(a / b); break;
        case "power": stack.push(pow(a, b)); break;
      }
    }
  }

  if (stack.length !== 1) throw "Invalid Expression";
  return stack[0];
}

function toRadians(deg) {
  return deg * pi / 180;
}

function toDegrees(rad) {
  return rad * 180 / pi;
}

function sin(x) {
  let term = x;
  let sum = x;
  for (let i = 1; i < 100; i++) {
    term *= -1 * x * x / ((2 * i) * (2 * i + 1));
    sum += term;
  }
  return sum;
}

function cos(x) {
  let term = 1;
  let sum = 1;
  for (let i = 1; i < 100; i++) {
    term *= -1 * x * x / ((2 * i - 1) * (2 * i));
    sum += term;
  }
  return sum;
}

function tan(x) {
  let c = cos(x);
  if (absolute(c) < epsilon) return Infinity;
  return sin(x) / c;
}

function absolute(c) {
  if (c < 0) return -c;
  else return c;
}

function asin(x) {
  if (x < -1 || x > 1) return NaN;
  if (x === 1) return pi / 2;
  if (x === -1) return -pi / 2;
  return atan(x / sqrt(1 - x * x));
}

function acos(x) {
  if (x < -1 || x > 1) return NaN;
  if (x === 1) return 0;
  if (x === -1) return pi;
  return pi / 2 - asin(x);
}

function atan(x) {
  if (x > 1) return pi / 2 - atan(1 / x);
  if (x < -1) return -pi / 2 - atan(1 / x);
  let term = x;
  let sum = x;
  for (let i = 1; i < 20; i++) {
    term *= -1 * x * x;
    sum += term / (2 * i + 1);
  }
  return sum;
}


function log(a) {
  return ln(a) / ln(10);
}

function ln(a) {
  if (a <= 0) return NaN;
  let y = (a - 1) / (a + 1);
  let sum = 0;
  for (let i = 0; i < 100; i++) {
    let term = (1 / (2 * i + 1)) * pow(y, 2 * i + 1);
    sum += term;
  }
  return 2 * sum;
}

function sqrt(n) {
  if (n < 0) return NaN;
  let x = n;
  for (let i = 0; i < 20; i++) {
    x = 0.5 * (x + n / x);
  }
  return x;
}

function cbrt(n) {
  if (n === 0) return 0;
  let x = n;
  for (let i = 0; i < 20; i++) {
    x = (2 * x + n / (x * x)) / 3;
  }
  return x;
}

function pow(base, exp) {
  if (base === 0 && exp <= 0) return NaN;
  if (exp === 0) return 1;
  if (Number.isInteger(exp)) {
    let result = 1;
    let positiveExp = exp > 0 ? exp : -exp;
    result=base**positiveExp;
    return exp > 0 ? result : 1 / result;
  }

  return exp > 0 ? expLn(base, exp) : 1 / expLn(base, -exp);
}

function expLn(base, exp) {
  return expSeries(exp * ln(base));
}

function expSeries(x) {
  let sum = 1;
  let term = 1;
  for (let i = 1; i < 100; i++) {
    term *= x / i;
    sum += term;
  }
  return sum;
}

