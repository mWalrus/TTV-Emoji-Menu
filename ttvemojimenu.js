/**
 * Sleeps for a set amount of time
 * @param {number} ms milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// if the user clicks inside that element
// we can assume the user is changing channel.
// we therefore need to reload the application
// for it to appear in the new chat window
// since twitch is single page.
document
  .querySelector('div.side-nav-section')
  .addEventListener('click', async () => {
    // we sleep a little before reloading the app
    // to allow for the chat module to load
    await sleep(5)
    initializeApplication()
  })

function initializeApplication() {
  console.log('[TTVEmoji Menu] (v1.8.5) Initializing...')
  emojiMenu()
  console.log('[TTVEmoji Menu] (v1.8.5) Done!')
}

initializeApplication()
