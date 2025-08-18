const pi = 3.141592653589793;
const e = 2.7182818;
const epsilon = 1e-12;

const validChars = /^[0-9+\-*/^%!().√∛πe\sA-Za-z]*$/;

const allowedFunctions = [
  "sin", "cos", "tan",
  "asin", "acos", "atan",
  "ln", "log"
];

const allowedConstants = ["e", "π"];

const mapping = {
  '^': "power",
  '√': "sqrt",
  'π': pi,
  'e': e,
  '!': "factorial",
  '∛': "cbrt"
};

const digits = "0123456789ABCDEF";

const digitMap={
        '0': 0, '1': 1, '2': 2, '3': 3,
        '4': 4, '5': 5, '6': 6, '7': 7,
        '8': 8, '9': 9, 'A': 10, 'B': 11,
        'C': 12, 'D': 13, 'E': 14, 'F': 15
    }

const currencies = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "SGD", "CHF", "CNY"];
