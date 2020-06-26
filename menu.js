'use strict'
/**
 * Creates the application and injects it in the DOM
 */
function emojiMenu() {
  /**
   * The container which the application will be injected into
   */
  const injectContainer = document.querySelector(
    '[data-a-target="chat-settings"]'
  ).parentNode.parentNode.parentNode

  /**
   * The chat textarea element
   */
  const chatBox = document.querySelector(
    '[data-a-target="chat-input"]'
  )

  /**
   * Determines if the menu should be shown or not
   */
  let show = false
  /**
   * Check used to prevent normal actions when user is in edit mode
   */
  let userInEditMode = false

  init()

  /**
   * Initializes all the components of the application
   */
  function init() {
    keyPressEvent()
    checkClicks()
    removePrevContainers()
    createBtn()
    createPopup()
  }

  /**
   * Listens for key presses. (Will not do anything when menu is not open)
   */
  function keyPressEvent() {
    //
    chatBox.addEventListener('keyup', (e) => {
      if (e.keyCode === 13 && show) {
        e.preventDefault()
        toggleMenu()
      }
    })
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 27 && userInEditMode) {
        e.preventDefault()
        editMode()
      }
    })
  }

  /**
   * Listens for clicks on the page, if a click happens that
   * is not inside the menu or if the menu is hidden.
   * (Will not execute in edit mode)
   */
  function checkClicks() {
    window.addEventListener('click', (e) => {
      // only pass if not in edit mode
      if (!userInEditMode) {
        // first check: the clicked element cannot be inside the popup container
        // second check: the clicked element cannot be the main toggle button
        // third check: the container must be currently visible
        if (
          !injectContainer
            .querySelector('#ttv-emoji-popup-container')
            .contains(e.target) &&
          e.target.id !== 'ttv-emoji-btn' &&
          show
        ) {
          toggleMenu()
        }
      }
    })
  }

  /**
   * Removes any possible duplicates of the application from the DOM
   */
  function removePrevContainers() {
    if (injectContainer.querySelector('#ttv-emoji-popup-container')) {
      injectContainer.removeChild(
        injectContainer.querySelector('#ttv-emoji-popup-container')
      )
    }
    if (injectContainer.querySelector('#ttv-emoji-btn'))
      injectContainer.removeChild(
        injectContainer.querySelector('#ttv-emoji-btn')
      )
  }

  /**
   * Creates the application button and inserts
   * it before the settings icon under chat
   */
  function createBtn() {
    // creating application button
    const btn = document.createElement('img')
    btn.id = 'ttv-emoji-btn'
    btn.title = 'TTV Emoji Picker'
    btn.alt = 'emoji picker button'
    btn.src =
      'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/248/middle-finger_1f595.png'
    btn.addEventListener('click', toggleMenu)
    // inject the button under the message box
    injectContainer.insertBefore(
      btn,
      injectContainer.querySelector('div.tw-inline-flex')
    )
  }

  /**
   * Toggles the menu between visible and invisible
   */
  function toggleMenu() {
    show = !show
    // grab the popup container from the DOM
    const popup = injectContainer.querySelector(
      '#ttv-emoji-popup-container'
    )
    if (show) {
      // if show is true we want to show the popup by removing the class "hidden"
      popup.classList.remove('hidden')
      popup.scrollTo(0, 0)
      chatBox.focus()
    } else {
      // if show is false we add the "hidden" to hide popup
      popup.classList.add('hidden')
      // if the user is in edit mode when we hide the popup
      // we want to exit edit mode also
      if (userInEditMode) {
        editMode()
      }
    }
  }

  /**
   * Creates the Emoji Menu container and inserts it into the DOM
   */
  function createPopup() {
    // creating the main combo element
    const main = document.createElement('div')
    main.id = 'ttv-emoji-popup-container'
    main.className = 'hidden'

    // creating the edit combo button
    const createComboBtn = document.createElement('p')
    createComboBtn.id = 'combo-edit-btn'
    createComboBtn.innerText = 'Edit Combos'
    createComboBtn.addEventListener('click', editMode)

    main.appendChild(createComboBtn)

    // Creates emoji container
    const emojiGrid = document.createElement('div')
    emojiGrid.className = 'emoji-grid'

    // Grab the combos from localstorage
    const combos = loadCombos()
    // if combos exist, add eventListeners to each, and append to DOM
    if (combos) {
      for (let combo of combos.childNodes[1].childNodes) {
        combo.addEventListener('click', (e) => {
          emojiClick(e, userInEditMode)
        })
      }
      emojiGrid.appendChild(combos)
    }

    // Go through each emoji category
    for (let emojiCategory of emojisArray) {
      const category = document.createElement('div')
      category.classList.add('category')

      // Add header for each category
      const header = document.createElement('h5')
      header.classList.add('header')
      header.innerText = emojiCategory.category
      category.appendChild(header)

      //Create container for the emojis to be put into
      const emojiContainer = document.createElement('div')
      emojiContainer.classList.add('ttv-emoji-contents')

      // go through each emoji of the current category and create an element for it
      for (let emoji of emojiCategory.emojis) {
        const emojiElement = document.createElement('span')
        emojiElement.classList.add('emoji-item')
        emojiElement.name = emoji
        emojiElement.innerText = emoji
        // handle click for that emoji
        emojiElement.addEventListener('click', (e) => {
          emojiClick(e, userInEditMode)
        })
        emojiContainer.appendChild(emojiElement)
      }
      category.appendChild(emojiContainer)
      emojiGrid.appendChild(category)
    }
    // append the application to the DOM
    main.appendChild(emojiGrid)
    injectContainer.appendChild(main)
  }

  /**
   * Toggles edit mode. (calls updateCombos when exiting edit mode)
   */
  function editMode() {
    // grabbing popup container
    const popupContainer = injectContainer.querySelector(
      '#ttv-emoji-popup-container'
    )
    // toggle edit mode check to tell menu how to behave
    userInEditMode = !userInEditMode
    // call edit mode to toggle it on or off (adds or removes content from the dom)
    editCombos()
    if (!userInEditMode) {
      // if user exits edit mode we update current collection of combos
      // and removes tooltip from DOM
      updateCombos()
      popupContainer.removeChild(
        popupContainer.querySelector('.edit-tip')
      )
    } else {
      // Creates the tooltip and inserts it after the "Edit combos" button
      const editTip = document.createElement('span')
      editTip.classList.add('edit-tip')
      editTip.innerText = 'Click a combo to edit it!'
      popupContainer.appendChild(editTip)
    }
  }
}

/**
 * Triggers when the user clicks an emoji element in the menu
 * @param {HTMLSpanElement} e the clicked emoji element
 * @param {boolean} userInEditMode boolean deciding if the user is in edit mode
 */
function emojiClick(e, userInEditMode) {
  // aborts if the name attribute is not set
  if (e.target.name === undefined) return

  // adds clicked emoji to the newest combo if the user is in edit mode and returns
  if (userInEditMode) {
    if (e.target.classList.contains('edit-mode')) return
    const emoji = e.target.name
    addToNewCombo(emoji)
    return
  }

  if (
    !e.target.querySelector('span.delete-btn') &&
    e.target.className !== 'delete-btn'
  ) {
    // in order to properly change the value of the textarea component we
    // need to simulate an input event on the component
    // so first we grab the element
    const ta = document.querySelector('[data-a-target="chat-input"]')

    // then we grab the property of the textarea we want to change
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set
    // we grab the previous value of the textarea
    const prevVal = ta.value
    if (prevVal.length > 0) {
      let newVal = prevVal
      if (prevVal.charAt(prevVal.length - 1) !== ' ') {
        newVal += ' '
      }
      // then we call the input value setter with the textarea
      // as the first argument and the value we want to set it to as the other
      nativeInputValueSetter.call(ta, newVal + e.target.name)
    } else {
      nativeInputValueSetter.call(ta, e.target.name + ' ')
    }

    // then we need to simulate the change event on the component
    // so we create an input event
    var event = new Event('input', { bubbles: true })
    // and send it off to the component
    ta.dispatchEvent(event)

    ta.focus()
  }
}
