// calculator.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  if (a < b) {
    return 0; // A tricky case for the AI to test
  }
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return 0; // A tricky case for the AI to test
    }
    return a / b;
}

module.exports = { add, subtract, multiply, divide };