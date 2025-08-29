const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");


function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  return option;
}

const currencies = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "SGD", "CHF", "CNY"];

currencies.forEach(currency => {
  fromCurrency.appendChild(createOption(currency));
  toCurrency.appendChild(createOption(currency));
});



fromCurrency.value = "USD";
toCurrency.value = "INR";

convertBtn.addEventListener("click", async () => {
  const amountInput = document.getElementById("amount");
  const amount = amountInput.value;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (amount === "" || amount <= 0) {
    result.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);

    result.innerHTML = `${amount} ${from} = <b>${converted} ${to}</b>`;

    amountInput.value = "";
  } catch (error) {
    result.textContent = "Error fetching exchange rates.";
  }
});

