convertBtn.addEventListener("click", () => {
    const numberInput = document.getElementById("number");
    const result = document.getElementById("result");

    const number = numberInput.value.trim();
    const fromBase = document.getElementById("fromBase").value;
    const toBase = document.getElementById("toBase").value;

    if (number === "") {
        result.textContent = "Please enter a number.";
        return;
    }

    try {
        
        if (!isValidNumberForBase(number,fromBase)) {
             result.textContent = "Invalid number for the selected base.";
             numberInput.value="";
            return;
        }

        
        const convertedValue = evaluate(fromBase,toBase,number)

        result.innerHTML = `${number} (Base ${fromBase}) = <b>${convertedValue} (Base ${toBase})</b>`;

        
        numberInput.value = "";
    } catch (error) {
        result.textContent = "Error in conversion.";
    }
});

function isValidNumberForBase(number, fromBase) {
    const digits = "0123456789ABCDEF";
    number = number.toUpperCase();

    for (let i = 0; i < number.length; i++) {
        let digitValue = digits.indexOf(number[i]);
        if (digitValue === -1 || digitValue >= fromBase){
            if(number[i]===".") continue;
            return false; 
        }
    }
    return true; 
}

function evaluate(fromBase,toBase,number){
       switch(fromBase){
       case "2":
         return binaryConversion(fromBase,toBase,number);
       case "8":
        return octalConversion(toBase,number);
       case "10":
        return decimalConversion(toBase,number);
       case "16":
        return hexadecimalConversion(toBase,number);
       }
}

function binaryConversion(fromBase,toBase,number){
    switch(toBase){
        case "8":
            return binarytooctalandhexadecimal(toBase,number);
        case "10":
            return todecimal(fromBase,number);
        case "16":
            return binarytooctalandhexadecimal(toBase,number);
    }
}

function todecimal(fromBase,number){
    numstr=number.toString();
    function power(i){
        let answer=1;
        for(let j=0;j<i;j++){
            answer*=fromBase;
        }
        return answer;
    }

function powerd(i){
    return 1/power(i);
}

    const parts=numstr.split(".");
    let integerpart=parts[0];
    let decimalpart=parts.length>1 ? parts[1] : "";
    let result=0;
    if (integerpart===0) result=0;
    else{
        for(let i=0;i<integerpart.length;i++){
            let a=parseInt(integerpart[integerpart.length-i-1]);
            result+=(a*power(i));
        }
    }

    if(decimalpart.length>0){
        for(let i=0;i<decimalpart.length;i++){
            let a=parseInt(decimalpart[i]);
            result+=(a*powerd(i+1));
        }
    }
    return result;
}

function binarytooctalandhexadecimal(toBase,number){
    return decimalConversion(toBase,todecimal(number));
}

function octalConversion(toBase,number){
    switch(toBase){
        case "10":
            return todecimal(8,number);
        case "2":
            return decimalConversion(toBase,todecimal(8,number));
        case "16":
            return decimalConversion(toBase,todecimal(8,number));
    }
}

function decimalConversion(toBase,number){
    const digit="0123456789ABCDEF";
    let integerpart=(number)-(number%1);
    let decimalpart=number-integerpart;
    let result="";
    if (integerpart===0) result="0";
    else{
        while(integerpart>0){
        result=digit[integerpart%toBase]+result;
        integerpart=(integerpart-(integerpart%toBase))/toBase;
        }
    }

    if(decimalpart>0){
        result+=".";
        let precision=8;
        while(decimalpart>0 && precision>0){
            decimalpart*=toBase;
            let digitvalue=decimalpart-(decimalpart%1);
            result+=digit[digitvalue];
            decimalpart=decimalpart-digitvalue;
            precision--;
        }
    }
    return result;
}

 function hexadecimalConversion(toBase,number){
    
}