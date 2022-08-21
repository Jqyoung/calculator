const display = document.querySelector('.display')
const numButtons = document.querySelectorAll('.numButton')
const operationButtons = document.querySelectorAll('.operation')

let input
let prevousInput
let number = ''
let accumulator
let operant = ''
let flag = true

numButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (button.classList.contains('delButton')) {
            input = 'Del'
        } else {
            input = button.textContent
        }

        if (input != '+' && input != '-' && input != '*' && input != '/' && input != '=' && input != 'AC' && input != 'Del' && input != '%' && input != '+/-' && input != '.') {
            if (flag == false) {
                number = ''
            }
            if (number.length >= 9 || (display.textContent == '0' && input == '0')) {
                return
            }
            number += button.textContent
            displayResult(number)
            //remove arithmatic operation button's background color
            removeBackgroundColor()

        } else if ((input == '+' || input == '-' || input == '*' || input == '/') && number != '') {
            //add background color to arithmatic operation buttons to indicate it is being selected
            button.classList.add("color-change")

            if (accumulator != undefined) {
                accumulator = operate(operant, accumulator, number)
                console.log('im calculating')
                displayResult(accumulator)

            } else {
                accumulator = number
                console.log('im acc=number')
            }
            operant = input
            number = ''
            flag = true

        } else if (input == '=' && number != '' && operant != '' && accumulator != undefined) {
            number = operate(operant, accumulator, number)
            // number = number.toString()
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
                if (number[number.length - 2] == '.') {
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
            if (number.toString().includes('.')) {
                return
            } else if (number == '') {
                number = '0' + '.'
                flag = true
            } else {
                number += input
            }
            displayResult(number)
        }
    })
})

window.addEventListener('keydown', event => {
    if (event.key == 'Backspace') {
        input = 'Del'
    } else if (event.key == 'Delete') {
        input = 'AC'
    }else if(event.key=='Enter' || event.key=='='){
        input='='
    } 
    else if(event.key=='Tab'){
        event.preventDefault()
        input='+/-'
    }
    else {
        input = event.key
    }

    console.log(input)
})


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

function percent(num) {
    return num / 100
}

function operate(operator, a, b) {
    if (a == 'ERROR')
        return 'ERROR'

    let precision
    let result

    a = +a
    b = +b

    precision = Math.pow(10, Math.max(decimalLength(a), decimalLength(b)))

    a = Math.round(a * precision)
    b = Math.round(b * precision)

    if (operator == '+') {
        result = add(a, b) / precision
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '-') {
        result = subtract(a, b) / precision
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '*') {
        result = multiply(a, b) / (precision * precision)
        console.log(result)
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '/') {
        result = divide(a, b)
        result = roundDigitToFitDisplay(result)
        return result

    } else if (operator == '%') {
        if (b != 0) {
            result = setDecimalPlace(b, precision)
            return Number(result)
        } else {
            result = setDecimalPlace(a, precision)
            return Number(result)
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


function displayResult(result) {
    if (result == '') {
        display.textContent = '0'
    } else {
        display.textContent = result
    }

}

function decimalLength(num) {
    let decimal
    //  console.log(num)

    if (num.toString().includes('e-') && num.toString().includes('.')) {
        decimal = num.toString().split('.').join(',').split('e-').join(',').split(',')
        // console.log(decimal[1].length)
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

function roundDigitToFitDisplay(result) {
    if (result.toString().length > 9) {
        result = result.toExponential(3)
        if (result.slice(2, 5) == '000') {
            console.log('i am rounding')
            result = result.replace('.000', '')
        }
    }
    return result
}

function removeBackgroundColor() {
    operationButtons.forEach((opButton) => {
        if (opButton.classList.contains('color-change')) {
            opButton.classList.remove('color-change')
        }
    })

}

function presseKeysButtons(e){
    if (button.classList.contains('delButton')) {
        input = 'Del'
    } else {
        input = button.textContent
    }

    if (input != '+' && input != '-' && input != '*' && input != '/' && input != '=' && input != 'AC' && input != 'Del' && input != '%' && input != '+/-' && input != '.') {
        if (flag == false) {
            number = ''
        }
        if (number.length >= 9 || (display.textContent == '0' && input == '0')) {
            return
        }
        number += button.textContent
        displayResult(number)
        //remove arithmatic operation button's background color
        removeBackgroundColor()

    } else if ((input == '+' || input == '-' || input == '*' || input == '/') && number != '') {
        //add background color to arithmatic operation buttons to indicate it is being selected
        button.classList.add("color-change")

        if (accumulator != undefined) {
            accumulator = operate(operant, accumulator, number)
            console.log('im calculating')
            displayResult(accumulator)

        } else {
            accumulator = number
            console.log('im acc=number')
        }
        operant = input
        number = ''
        flag = true

    } else if (input == '=' && number != '' && operant != '' && accumulator != undefined) {
        number = operate(operant, accumulator, number)
        // number = number.toString()
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
            if (number[number.length - 2] == '.') {
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
        if (number.toString().includes('.')) {
            return
        } else if (number == '') {
            number = '0' + '.'
            flag = true
        } else {
            number += input
        }
        displayResult(number)
    }
}