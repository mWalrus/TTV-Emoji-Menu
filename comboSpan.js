/**
 * Analyses the length of the combo element and adjusts the class name according to it
 * @param {number} l  length of the container
 * @param {string} combo container to be modified
 */
function adjustComboSpan(l, combo) {
  if (l > 5 && l < 14 && !combo.classList.contains('span-two')) {
    combo.classList.add('span-two')
  } else if (l > 11 && !combo.classList.contains('span-three')) {
    if (combo.classList.contains('span-two')) {
      combo.classList.remove('span-two')
    }
    combo.classList.add('span-three')
  } else if (l > 20 && !combo.classList.contains('span-four')) {
    if (combo.classList.contains('span-three')) {
      combo.classList.remove('span-three')
    }
    combo.classList.add('span-four')
  }
}
