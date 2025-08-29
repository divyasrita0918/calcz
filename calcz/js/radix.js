const numberInput = document.getElementById("number");
const fromBaseSelect = document.getElementById("fromBase");
const toBaseSelect = document.getElementById("toBase");
const validationMsg = document.getElementById("validationMsg");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");

numberInput.addEventListener("input", () => {
    const number = numberInput.value.trim();
    const fromBase = fromBaseSelect.value;

    if (number === "") {
        validationMsg.textContent = "";
        convertBtn.disabled = false; 
        return;
    }

    if (!isValidNumberForBase(number, fromBase)) {
        validationMsg.textContent = `✘ Invalid number for base ${fromBase}`;
        validationMsg.style.color = "red";
        convertBtn.disabled = true;
    } else {
        validationMsg.textContent = "";
        convertBtn.disabled = false;
    }
});

convertBtn.addEventListener("click", () => {
    const number = numberInput.value.trim();
    const fromBase = fromBaseSelect.value;
    const toBase = toBaseSelect.value;

    if (number === "") {
        result.textContent = "Please enter a number.";
        return;
    }

    try {

        if (!isValidNumberForBase(number, fromBase)) {
            result.textContent = "Invalid number for the selected base.";
            numberInput.value = "";
            return;
        }


        const convertedValue = evaluate(fromBase, toBase, number)

        result.innerHTML = `${number} (Base ${fromBase}) = <b>${convertedValue} (Base ${toBase})</b>`;


        numberInput.value = "";
    } catch (error) {
        result.textContent = "Error in conversion.";
        console.log(error);
    }
});

function isValidNumberForBase(number, fromBase) {

    number = number.toUpperCase();

    for (let i = 0; i < number.length; i++) {
        let digitValue = digits.indexOf(number[i]);
        if (digitValue === -1 || digitValue >= fromBase) {
            if (number[i] === ".") continue;
            return false;
        }
    }
    return true;
}

function evaluate(fromBase, toBase, number) {
    switch (fromBase) {
        case "2":
            return binaryConversion(fromBase, toBase, number);
        case "8":
            return octalConversion(toBase, number);
        case "10":
            return decimalConversion(toBase, number);
        case "16":
            return hexadecimalConversion(toBase, number);
    }
}

function binaryConversion(fromBase, toBase, number) {
    switch (toBase) {
        case "8":
            return binarytooctalandhexadecimal(toBase, number);
        case "10":
            return todecimal(fromBase, number);
        case "16":
            return binarytooctalandhexadecimal(toBase, number);
    }
}

function todecimal(fromBase, number) {
    numstr = number.toString().toUpperCase();

    function power(i) {
        let answer = 1;
        for (let j = 0; j < i; j++) {
            answer *= fromBase;
        }
        return answer;
    }

    function powerd(i) {
        return 1 / power(i);
    }

    const parts = numstr.split(".");
    let integerpart = parts[0];
    let decimalpart = parts.length > 1 ? parts[1] : "";
    let result = 0;
    if (integerpart === "0") result = 0;
    else {
        for (let i = 0; i < integerpart.length; i++) {
            let char = integerpart[integerpart.length - i - 1];
            let a = digitMap[char];
            result += (a * power(i));
        }
    }

    if (decimalpart.length > 0) {
        for (let i = 0; i < decimalpart.length; i++) {
            let char = decimalpart[i];
            let a = digitMap[char];
            result += (a * powerd(i + 1));
        }
    }
    return result;
}

function binarytooctalandhexadecimal(toBase, number) {
    let a;
    if (toBase === "8") a = 3;
    else a = 4;

    let parts = number.split(".");
    let intPart = parts[0];
    let fracPart = parts.length > 1 ? parts[1] : "";

    while (intPart.length % a !== 0) {
        intPart = "0" + intPart;
    }

    let intResult = "";
    for (let i = 0; i < intPart.length; i += a) {
        let slice = intPart.slice(i, i + a);
        if (a === 3)
            intResult += mapoct[slice];
        else
            intResult += maphex[slice];
    }
    intResult = intResult.replace(/^0+/, "") || "0";

    let fracResult = "";
    if (fracPart.length > 0) {
        while (fracPart.length % a !== 0) {
            fracPart = fracPart + "0";
        }

        for (let i = 0; i < fracPart.length; i += a) {
            let slice = fracPart.slice(i, i + a);
            if (a === 3)
                fracResult += mapoct[slice];
            else
                fracResult += maphex[slice];
        }

        fracResult = fracResult.replace(/0+$/, "");
    }

    return fracResult.length > 0 ? intResult + "." + fracResult : intResult;
}


function octalConversion(toBase, number) {
    switch (toBase) {
        case "10":
            return todecimal(8, number);
        case "2":
            return ToBinary(8, number);
        case "16":
            return binarytooctalandhexadecimal(toBase, ToBinary(8, number));
    }
}

function ToBinary(fromBase, number) {
    number = number.toUpperCase();
    let parts = number.split(".");
    let intPart = parts[0];
    let fracPart = parts.length > 1 ? parts[1] : "";

    let intResult = "";
    for (let i = 0; i < intPart.length; i++) {
        if (fromBase === 8)
            intResult += octalToBinarymap[intPart[i]];
        else
            intResult += hexToBinaryMap[intPart[i]];
    }
    intResult = intResult.replace(/^0+/, "") || "0";

    let fracResult = "";
    for (let i = 0; i < fracPart.length; i++) {
        if (fromBase === 8)
            fracResult += octalToBinarymap[fracPart[i]];
        else
            fracResult += hexToBinaryMap[fracPart[i]];
    }
    fracResult = fracResult.replace(/0+$/, "");

    return fracResult.length > 0 ? intResult + "." + fracResult : intResult;
}



function decimalConversion(toBase, number) {
    let integerpart = (number) - (number % 1);
    let decimalpart = number - integerpart;
    let result = "";
    if (integerpart === 0) result = "0";
    else {
        while (integerpart > 0) {
            result = digits[integerpart % toBase] + result;
            integerpart = (integerpart - (integerpart % toBase)) / toBase;
        }
    }

    if (decimalpart > 0) {
        result += ".";
        let precision = 8;
        while (decimalpart > 0 && precision > 0) {
            decimalpart *= toBase;
            let digitvalue = decimalpart - (decimalpart % 1);
            result += digits[digitvalue];
            decimalpart = decimalpart - digitvalue;
            precision--;
        }
    }
    return result;
}

function hexadecimalConversion(toBase, number) {
    switch (toBase) {
        case "2":
            return ToBinary(16, number);
        case "8":
            return binarytooctalandhexadecimal(toBase, ToBinary(16, number));
        case "10":
            return todecimal(16, number);
    }
}