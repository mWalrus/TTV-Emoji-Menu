/**
 * boolean deciding if user should enter or exit edit mode
 */
var editMode = false

/**
 * Controls edit mode
 */
function editCombos() {
  /**
   * The parent element of all combos
   */
  const comboContainer = document.querySelector('.combos')
  /**
   * All the current combos
   */
  const combos = comboContainer.querySelectorAll('.combo')
  toggle()

  /**
   * Toggles the edit mode
   */
  function toggle() {
    !editMode ? enterEditMode() : exitEditMode()
    editMode = !editMode
    // console.log(editMode)
  }

  /**
   * Sets the user into edit mode
   */
  function enterEditMode() {
    for (let combo of combos) {
      combo.appendChild(createRemoveBtn())
      combo.classList.add('edit-mode')
    }

    comboContainer.appendChild(newComboBtn())
  }

  /**
   * Exits the user from edit mode
   */
  function exitEditMode() {
    for (let combo of comboContainer.querySelectorAll('.combo')) {
      if (!combo.classList.contains('non-editable')) {
        comboContainer.removeChild(combo)
      } else {
        for (let span of combo.querySelectorAll('span')) {
          combo.removeChild(span)
        }
      }
    }
  }

  
  /**
   * Creates the '+' (new combo) button placed after all defined combos when in edit mode
   */
  function newComboBtn() {
    const addCombo = document.createElement('span')
    addCombo.classList.add('add-combo', 'combo')
    addCombo.id = 'create-combo'
    addCombo.innerText = '+'
    addCombo.addEventListener('click', createComboContainer)
    return addCombo
  }

  /**
   * Creates a new combo container for the user to edit
   * @param {Event} e element that triggered the event
   */
  function createComboContainer(e) {
    comboContainer.removeChild(e.target)
    
    const newCombo = document.createElement('span')
    newCombo.classList.add('emoji-item', 'combo', 'edit-mode')
    newCombo.innerText = '...'
    newCombo.appendChild(createRemoveBtn())
    comboContainer.appendChild(newCombo)
    
    comboContainer.appendChild(newComboBtn())
  }
}
/**
 * Removes a combo from the collection
 * @param {Event} e element that triggered the event
 */
function removeCombo(e) {
  document.querySelector('.combos').removeChild(e.target.parentNode)
}

/**
 * Creates the remove button placed inside each combo element during edit mode
 */
function createRemoveBtn() {
  const btn = document.createElement('span')
  btn.classList.add('delete-btn')
  btn.innerText = '✖'

  btn.addEventListener('click', removeCombo)
  return btn
}

/**
 * Adds content to the new combo being created
 * @param {string} emoji emoji string
 */
function addToNewCombo(emoji) {

  const comboContainer = document.querySelector('.combos')
  const combos = comboContainer.querySelectorAll('.combo')

  const lastComboContainer = comboContainer.childNodes[combos.length - 2]

  if (lastComboContainer.classList.contains('non-editable')) return

  for (let span of lastComboContainer.querySelectorAll('span')) {
    lastComboContainer.removeChild(span)
  }

  const comboText = lastComboContainer.innerText

  // if the contents of the current combo box is '+' then we know
  // that the user is trying to add emojis to the 'add combo' element
  // and when that is the case we dont modify the element
  if (comboText === '+') return

  
  if (comboText.match(/\.\.\./)) {
    lastComboContainer.innerText = emoji
    lastComboContainer.name = emoji
  } else {
    lastComboContainer.innerText = comboText + ' ' + emoji
    lastComboContainer.name = comboText + ' ' + emoji
  }
  
  const length = lastComboContainer.innerText.length
  
  adjustComboSpan(length, lastComboContainer)
  
  lastComboContainer.appendChild(createSaveBtn())
  lastComboContainer.appendChild(createRemoveBtn())
}

/**
 * Creates the save combo button placed inside the newly started combo
 */
function createSaveBtn() {
  const btn = document.createElement('span')
  btn.classList.add('save-combo')
  btn.innerText = '✔'
  btn.addEventListener('click', updateComboAmount)
  return btn
}

/**
 * Updates the combo counter and adds an event listener to the newly created combo
 * @param {Event} e element that triggered event
 */
function updateComboAmount(e) {
  const combo = e.target.parentNode
  combo.classList.add('non-editable')
  // adding eventlistener to the edited element
  combo.addEventListener('click', (emoji) => {
    emojiClick(emoji, false)
  })
  updateCombos()
}
