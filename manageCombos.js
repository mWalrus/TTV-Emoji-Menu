/**
 * boolean deciding if user should enter or exit edit mode
 */
var editMode = false

/**
 * Holds an already defined combo the user wants to edit, is otherwise null
 */
var predefinedComboToEdit = null

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
  }

  /**
   * Sets the user into edit mode
   */
  function enterEditMode() {
    for (let combo of combos) {
      // insert a remove combo button
      combo.appendChild(createRemoveBtn())
      // add class edit-mode
      combo.classList.add('edit-mode')

      addClickToEdit(combo)
    }
    // insert new combo button after all combos
    comboContainer.appendChild(newComboBtn())
  }

  /**
   * Exits the user from edit mode
   */
  function exitEditMode() {
    for (let combo of comboContainer.querySelectorAll('.combo')) {
      // removes the ability to click a combo to edit it
      combo.removeEventListener('click', comboClickHandler)
      if (!combo.classList.contains('non-editable')) {
        // remove element if it isn't a saved combo
        comboContainer.removeChild(combo)
      } else {
        // removes all the buttons inside the combo element
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

    comboContainer.appendChild(newCombo).appendChild(newComboBtn())
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
 * Adds content to the new combo being created
 * @param {string} emoji emoji string
 */
function addToNewCombo(emoji) {
  const comboContainer = document.querySelector('.combos')
  const combos = comboContainer.querySelectorAll('.combo')

  // if user clicked a predefined combo to edit we want that as our target
  const comboToEdit = predefinedComboToEdit
    ? predefinedComboToEdit
    : comboContainer.childNodes[combos.length - 2]

  // checking for false positives
  if (comboToEdit.classList.contains('non-editable')) return

  updateValue(comboToEdit, emoji)
}

/**
 * Updates the value of a given combo
 * @param {HTMLNode} combo the combo to apply the emoji to
 * @param {String} emoji the emoji to add
 */
function updateValue(combo, emoji) {
  // remove all buttons inside combo
  for (let span of combo.querySelectorAll('span')) {
    combo.removeChild(span)
  }

  const comboText = combo.innerText

  // prevent user from modifying add combo button
  if (comboText === '+') return

  if (comboText.match(/\.\.\./)) {
    // if combo contains 3 dots it is the first value update the
    // user has made so we replace everything
    combo.innerText = combo.name = emoji
  } else {
    combo.innerText = combo.name = comboText + ' ' + emoji
  }

  const length = combo.innerText.length

  adjustComboSpan(length, combo)

  // re-add buttons to combo
  combo.appendChild(createSaveBtn()).appendChild(createRemoveBtn())
}

/**
 * Creates the remove button placed inside each combo element during edit mode
 */
function createRemoveBtn() {
  const btn = document.createElement('span')
  btn.classList.add('delete-btn', 'right-btn')
  btn.innerText = '✖'

  btn.addEventListener('click', removeCombo)
  return btn
}

/**
 * Makes combos clickable when in edit mode
 * @param {combo} c combo to make clickable
 */
function addClickToEdit(c) {
  c.addEventListener('click', comboClickHandler)
}

/**
 * Handles combo clicks
 * @param {event} e clicked element
 */
function comboClickHandler(e) {
  e.target.removeEventListener('click', comboClickHandler)
  predefinedComboToEdit = e.target
  predefinedComboToEdit.classList.remove('non-editable')
  predefinedComboToEdit.appendChild(createSaveBtn())
}

/**
 * Creates the save combo button placed inside the newly started combo
 */
function createSaveBtn() {
  const btn = document.createElement('span')
  btn.classList.add('save-combo', 'left-btn')
  btn.innerText = '✔'
  btn.addEventListener('click', saveComboChanges)
  // resetting variable to stop further edits
  predefinedComboToEdit = null
  return btn
}

/**
 * Updates the combo counter and adds an event listener to the newly created combo
 * @param {Event} e element that triggered event
 */
function saveComboChanges(e) {
  const combo = e.target.parentNode
  combo.classList.add('non-editable')
  combo.removeChild(combo.querySelector('.save-combo'))
  addClickToEdit(combo)
  // reset event listener to prevent having multiple on the same target
  combo.removeEventListener('click', addNewEmojiClickHandler)
  combo.addEventListener('click', addNewEmojiClickHandler)
  updateCombos()
}

/**
 * Handles emoji clicks for new combos
 * @param {HTMLNode} emoji the newly created combo element
 */
function addNewEmojiClickHandler(emoji) {
  emojiClick(emoji, false)
}
