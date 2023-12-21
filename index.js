const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle to grey
setIndicator('#ccc');


//set password length 
function handleSlider() {
    let inputSlider = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // const min = inputSlider.min;
    // const max = inputSlider.max;
    // inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

    
}


//set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;

    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//get random number
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; 
}

//get random number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

//get Lower case
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
} 

//get Upper case
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
} 


//get symbols
function generateSymbols() {

    const randNum = getRndInteger(0, symbols.length);

    console.log("symbol number" + randNum);
    return symbols.charAt(randNum);
}

// calculate strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


// copy content
async function copyContent() {

    try {

        //the writeText() method return a promise that's why we need to make it async and await and need for try catch if an errors
        await navigator.clipboard.writeText(passwordDisplay.value);

        copyMsg.innerText = "copied";
    } catch (error) {
        copyMsg.innerHTML = "Failed";
    }

    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider(); 
})

function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkbox ) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    //special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
})


generateBtn.addEventListener('click', () => {
    //none of the checkbox are seleted
    if(checkCount == 0) {
        return;
    }

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the journey");
    //let's start the method to find password

    //remove old password
    password = "";

    //let's put all the stuff mentioned in checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if(symbols.checked) {
    //     password += generateSymbols();
    // }


    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    //mandotory addition

    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("compulsory addition done");

    //remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++) {

        let randIndex = getRndInteger(0, funcArr.length);
        console.log("rndIndex" + randIndex)
        password += funcArr[randIndex]();
        console.log("Remaining addition done");
        
    }
    //shuffling
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    console.log("UI addtion done");
    //calculate Strength
    calcStrength();

});