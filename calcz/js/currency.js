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

const CACHE_EXPIRY = 12 * 60 * 60 * 1000; 

async function fetchRates(base) {
  const cacheKey = `rates_${base}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    const now = Date.now();

    if (now - parsed.timestamp < CACHE_EXPIRY) {
      return parsed.rates;
    }
  }

  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  const data = await res.json();

  localStorage.setItem(cacheKey, JSON.stringify({
    rates: data.rates,
    timestamp: Date.now()
  }));

  return data.rates;
}

convertBtn.addEventListener("click", async () => {
  const amountInput = document.getElementById("amount");
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    result.textContent = "Please enter a valid amount.";
    return;
  }

  result.innerHTML = `<i>Loading...</i>`;

  try {
    const rates = await fetchRates(from);
    const rate = rates[to];
    const converted = (amount * rate).toFixed(2);

    result.innerHTML = `${amount} ${from} = <b>${converted} ${to}</b>`;
    amountInput.value = "";
  } catch (error) {
    console.error(error);
    result.textContent = "Error fetching exchange rates.";
  }
});
