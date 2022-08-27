const display = document.querySelector('.display')
const numButtons = document.querySelectorAll('.numButton')
const operationButtons = document.querySelectorAll('.operation')

let input
let number = ''
let accumulator
let operant = ''
let flag = true

//Perform functions when buttons are clicked by the user
numButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (button.classList.contains('delButton')) {
            input = 'Del'
        } else {
            input = button.textContent
        }
        //Call function to perform calculation based on user input
        presseKeysButtons(e, button)
    })
})

//Perform functions when user pressed keys on the keyboard
window.addEventListener('keydown', event => {
    let btArray = Array.from(numButtons)
    const entry = (element) => element.textContent == event.key

    //Check whether or not the key pressed by user is valid and coorespond to a button on the calculator
    if (btArray.some(entry) == true) {
        input = event.key
    } else if (event.key == 'Backspace') {
        input = 'Del'
    } else if (event.key == 'Delete') {
        input = 'AC'
    } else if (event.key == 'Enter') {
        event.preventDefault()
        input = '='
    } else if (event.key == 'Tab') {
        event.preventDefault()
        input = '+/-'
    } else {
        input = undefined
    }

    //if user input is valid then call the function to perform calculation
    if (input != undefined) {
        //add button click effect when the corresponding key is pressed
        numButtons.forEach((bt) => {
            if (bt.textContent == input || bt.getAttribute('ID') == input) {
                bt.classList.add('keydown-active')
                window.addEventListener('keyup', () => {
                    bt.classList.remove('keydown-active')
                })
            }
        })
        //call the function to calculate    
        presseKeysButtons(event)
    }
})

//functions to perform each arithmetic operation
function add(a, b) {
    return a + b
}

function subtract(a, b) {
    return a - b
}

function multiply(a, b) {
    return a * b
}

function divide(a, b) {
    if (b == 0) {
        return "ERROR"
    } else {
        return a / b
    }
}

//function that performs calculation based on the user input
function operate(operator, a, b) {
    if (a == 'ERROR')
        return 'ERROR'

    let precision
    let result

    a = +a
    b = +b

    //determines how many decimal point numbers have and get rid of the decimal points by times 10 to the power
    precision = Math.pow(10, Math.max(decimalLength(a), decimalLength(b)))
    //convert the numbers that will be in the calculation to whole numbers
    a = Math.round(a * precision)
    b = Math.round(b * precision)

    if (operator == '+') {
        result = add(a, b) / precision
        //convert the result to scientific notation if it has more than 9 digits
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '-') {
        result = subtract(a, b) / precision
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '*') {
        result = multiply(a, b) / (precision * precision)
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '/') {
        result = divide(a, b)
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '%') {
        if (b != 0) {
            result = setDecimalPlace(b, precision)
            result = roundDigitToFitDisplay(+result)
            return result
        } else {
            result = setDecimalPlace(a, precision)
            result = roundDigitToFitDisplay(+result)
            return result
        }
    } else if (operator == '+/-') {
        if (b != 0) {
            b *= -1
            result = b / precision
        } else {
            a *= -1
            result = a / precision
        }
        return result.toString()
    }
}

//function to display the calculated result
function displayResult(result) {
    if (result == '') {
        display.textContent = '0'
    } else {
        display.textContent = result
    }

}

//function to determine how many decimal place a number has
function decimalLength(num) {
    let decimal

    if (num.toString().includes('e-') && num.toString().includes('.')) {
        decimal = num.toString().split('.').join(',').split('e-').join(',').split(',')
        return decimal[1].length + +decimal[2]
    }

    if (num.toString().includes('e-')) {
        decimal = num.toString().split('e-')
        return +decimal[1]
    }

    decimal = num.toString().split('.')
    if (!decimal[1]) {
        return 0
    } else
        return decimal[1].length
}

//function used with % operator to round the first part of a scientific notation before 'e' due to javascript's strange default rounding behaviour
function setDecimalPlace(num, precision) {
    let digit = num.toString().length
    let result = num / (precision * 100)
    result = result.toString()

    if (result.includes('e')) {
        if (result.split('e')[0].length > digit) {
            let temp
            result = result.split('e')
            result[0] = Number(result[0]).toFixed(digit - 1)
            temp = result[1]
            result[1] = 'e'
            result[2] = temp
            result = result.toString().replace(/,/g, '')
        }
    }
    return result
}

//function that turns the result into scientific notation if its longer than 9 digits which won't fit the display
function roundDigitToFitDisplay(result) {
    if (result.toString().length > 9) {
        result = result.toExponential(3)
        if (result.slice(2, 5) == '000') {
            result = result.replace('.000', '')
        }
    }
    return result
}

//remove the css background color for arithmetic operators 
function removeBackgroundColor() {
    operationButtons.forEach((opButton) => {
        if (opButton.classList.contains('color-change')) {
            opButton.classList.remove('color-change')
        }
    })

}

//function that perform actions based on button or key input by the user
function presseKeysButtons(e, button) {
    if (input != '+' && input != '-' && input != '*' && input != '/' && input != '=' && input != 'AC' && input != 'Del' && input != '%' && input != '+/-' && input != '.') {
        if (flag == false) {
            number = ''
        }
        //determine if the number entered is longer than the maximum the display can hold
        if ((number.length >= 9 && number.includes('.') == false) || (display.textContent == '0' && input == '0')) {
            return
        } else if (number.includes('.') == true && number.length > 9) {
            return
        }
        //determine if the event is click or keydown
        if (e.type == 'click') {
            number += button.textContent
            flag = true
        } else if (e.type == 'keydown') {
            number += input
            flag = true
        } else {
            return
        }
        displayResult(number)
        //remove arithmatic operation button's background color
        removeBackgroundColor()

    } else if ((input == '+' || input == '-' || input == '*' || input == '/') && number != '') {
        //add background color to arithmatic operation buttons to indicate it is being selected
        if (e.type == 'click') {
            button.classList.add("color-change")
        } else {
            operationButtons.forEach((bt) => {
                if (bt.textContent == input) {
                    bt.classList.add('color-change')
                }
            })
        }
        //operates on two values, the previous entered is saved in accmulator variable and the current entered is in number variable
        if (accumulator != undefined) {
            accumulator = operate(operant, accumulator, number)
            displayResult(accumulator)
        } else {
            accumulator = number
        }
        operant = input
        number = ''
        flag = true

    } else if (input == '=' && number != '' && operant != '' && accumulator != undefined) {
        number = operate(operant, accumulator, number)
        displayResult(number)
        accumulator = undefined
        flag = false

    } else if (input == 'AC') {
        number = ''
        operant = ''
        accumulator = undefined
        displayResult('0')
        flag = true
        removeBackgroundColor()

    } else if (input == 'Del') {
        if (number == 'ERROR' || accumulator == 'ERROR') {
            number = ''
            operant = ''
            accumulator = undefined
            displayResult('0')
        } else if (number == '' && operant != '' && operant != '=') {
            operant = ''
            number = accumulator
            accumulator = undefined
            //remove arithmatic operation button's background color
            removeBackgroundColor()
        } else if (typeof number == 'string' && number.includes('e') == false) {
            if (number[number.length - 2] == '.' || number[number.length - 2] == '-') {
                number = number.slice(0, number.length - 2)
            } else {
                number = number.slice(0, number.length - 1)
            }
            displayResult(number)
        }

    } else if (input == '%') {
        if (display.textContent == 'ERROR') {
            return
        } else if (number != '') {
            number = operate(input, accumulator, number)
            displayResult(number)
        } else if (accumulator != undefined) {
            accumulator = operate(input, accumulator, number)
            displayResult(accumulator)
        }

    } else if (input == '+/-') {
        if (display.textContent == 'ERROR') {
            return
        } else if (number != '') {
            number = operate(input, accumulator, number)
            displayResult(number)
        } else if (accumulator != undefined) {
            accumulator = operate(input, accumulator, number)
            displayResult(accumulator)
        }

    } else if (input == '.') {
        if ((number.toString().includes('.') && flag != false) || number.toString().length >= 9) {
            return
        } else if (number == '' || flag == false) {
            number = '0' + '.'
            flag = true
        } else {
            number += input
            flag = true
        }
        displayResult(number)
    }
}//end of function