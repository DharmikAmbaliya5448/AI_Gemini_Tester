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

module.exports = { add, subtract };