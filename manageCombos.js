/**
 * boolean deciding if user should enter or exit edit mode
 */
var editMode = false
/**
 * true if the user has clicked the plus icon when editing combos.
 * (prevents the user from editing other, already defined, combos)
 */
var clickedNew = false
/**
 * The original value of combos when the user enters edit mode.
 * (Used to prevent user from editing already defined combos)
 */
var baseAmountOfCombos = document.querySelectorAll('.combo').length

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
    for (let i = 0; i < combos.length; i++) {
      const combo = combos[i]

      combo.appendChild(createRemoveBtn(i))

      combo.classList.add('edit-mode')
    }

    comboContainer.appendChild(newComboBtn())
  }

  /**
   * Exits the user from edit mode
   */
  function exitEditMode() {
    for (let combo of combos) {
      if (combo.querySelector('.delete-btn')) {
        const removeBtn = combo.querySelector('.delete-btn')
        combo.removeChild(removeBtn)
      }
      if (combo.querySelector('.save-combo')) {
        // const saveBtn = combo.querySelector('.save-combo')
        combo.parentNode.removeChild(combo)
        continue
      }
      if (combo.classList.contains('edit-mode')) {
        combo.classList.remove('edit-mode')
      }
      if (combo.innerText.match(/\.\.\./)) {
        comboContainer.removeChild(combo)
      }
      // console.log(combo.classList)
    }
    comboContainer.removeChild(comboContainer.querySelector('.add-combo'))
  }

  /**
   * Removes a combo from the collection
   * @param {Event} e element that triggered the event
   */
  function removeCombo(e) {
    comboContainer.removeChild(e.target.parentNode)

    // console.log(comboContainer.childNodes.length)
    // console.log(baseAmountOfCombos)
    // puts the check back in place to prevent user from adding on to the already defined combos
    if (comboContainer.childNodes.length === baseAmountOfCombos - 1) {
      clickedNew = false
    }
  }

  /**
   * Creates the remove button placed inside each combo element during edit mode
   * @param {number} i id to add to the remove button
   */
  function createRemoveBtn(i) {
    const btn = document.createElement('span')
    btn.classList.add('delete-btn')
    btn.id = i
    btn.innerText = '✖'

    btn.addEventListener('click', removeCombo)
    return btn
  }

  /**
   * Creates the '+' (new combo) button placed after all defined combos
   */
  function newComboBtn() {
    const addCombo = document.createElement('span')
    addCombo.classList.add('add-combo', 'combo')
    addCombo.id = 'create-combo'
    addCombo.innerText = '+'
    addCombo.addEventListener('click', createCombo)
    return addCombo
  }

  /**
   * Creates a new combo container for the user to edit
   * @param {Event} e element that triggered the event
   */
  function createCombo(e) {
    const index = comboContainer.childNodes.length
    const addBtn = e.target

    const newCombo = document.createElement('span')
    newCombo.classList.add('emoji-item', 'combo', 'edit-mode')
    newCombo.innerText = '...'
    newCombo.appendChild(createRemoveBtn(index))

    comboContainer.removeChild(addBtn)
    comboContainer.appendChild(newCombo)
    comboContainer.appendChild(addBtn)

    clickedNew = true
  }
}

/**
 * Adds content to the new combo being created
 * @param {string} emoji emoji string
 */
function addToNewCombo(emoji) {
  if (!clickedNew) return

  const comboContainer = document.querySelector('.combos')
  const combos = comboContainer.querySelectorAll('.combo')

  const lastComboContainer = comboContainer.childNodes[combos.length - 2]
  const comboText = lastComboContainer.innerText
    .replace('\n✖', '')
    .replace('\n✔', '')

  // if the contents of the current combo box is '+' then we know
  // that the user is trying to add emojis to the 'add combo' element
  // and when that is the case we dont modify the element
  if (comboText === '+') return

  const delBtn = lastComboContainer.querySelector('.delete-btn')

  lastComboContainer.removeChild(delBtn)

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
  lastComboContainer.appendChild(delBtn)
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
  baseAmountOfCombos = document.querySelectorAll('.combo').length
  // adding eventlistener to the edited element
  e.target.parentNode.addEventListener('click', (e) => {
    emojiClick(e, false)
  })
  updateCombos()
}
