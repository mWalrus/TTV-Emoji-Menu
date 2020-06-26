/**
 * Loads combos from localStorage and creates a div container for them
 */
function loadCombos() {
  const combos = JSON.parse(localStorage.getItem('ttv-emoji-combos'))

  const category = document.createElement('div')
  category.classList.add('category')

  const header = document.createElement('h5')
  header.classList.add('header')
  // if the combos item in localstorage is empty then we "hide" the header
  header.innerText = combos ? combos.category : ''
  category.appendChild(header)

  const emojiContainer = document.createElement('div')
  emojiContainer.classList.add('ttv-emoji-contents', 'combos')

  if (combos) {
    for (let combo of combos.emojis) {
      const emojiItem = document.createElement('span')
      emojiItem.classList.add('emoji-item', 'combo', 'non-editable')
      emojiItem.innerText = emojiItem.name = combo
      adjustComboSpan(combo.length, emojiItem)
      emojiContainer.appendChild(emojiItem)
    }
  }
  category.appendChild(emojiContainer)
  return category
}

/**
 * Takes the combo items from the menu and pushes their content to localStorage
 */
function updateCombos() {
  const combos = document.querySelectorAll('.combo')

  const emojis = []
  for (let combo of combos) {
    // we dont want to save the "new combo" button's contents
    if (combo.id === 'create-combo') {
      continue
    }
    if (combo.querySelector('.save-combo')) {
      combo.removeChild(combo.querySelector('.save-combo'))
    }
    const text = combo.innerText.replace('\n✔', '').replace('\n✖', '')
    emojis.push(text)
  }
  const result = {
    category: 'Combos',
    emojis,
  }

  localStorage.setItem('ttv-emoji-combos', JSON.stringify(result))
}
