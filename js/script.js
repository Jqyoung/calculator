const display = document.querySelector('.display')
const numButtons = document.querySelectorAll('.numButton')

let input
let number = ''
let accumulator
let operant = ''
let flag = true

numButtons.forEach((button) => {
    button.addEventListener('click', () => {
        input = button.textContent

        if (input != '+' && input != '-' && input != '*' && input != '/' && input != '=' && input != 'AC' && input != 'Del' && input != '%' && input != '+/-' && input != '.') {
            if (flag == false) {
                number = ''
            }
            number += button.textContent
            displayResult(number)

        } else if ((input == '+' || input == '-' || input == '*' || input == '/') && number != '') {
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
            } else if (typeof number == 'string') {
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
        result = add(a, b)
        return result / precision

    } else if (operator == '-') {
        result = subtract(a, b)
        return result / precision

    } else if (operator == '*') {
        result = multiply(a, b)
        return result / (precision * precision)

    } else if (operator == '/') {
        result = divide(a, b)
        return result

    } else if (operator == '%') {
        if (b != 0) {
            result = setDecimalPlace(b, precision)
            return result
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