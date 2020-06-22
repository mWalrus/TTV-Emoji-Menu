/**
 * Sleeps for a set amount of time
 * @param {number} ms milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

document
  .querySelector('div.side-nav-section')
  .addEventListener('click', async () => {
    await sleep(5)
    emojiMenu()
  })

console.log('[TTVEmoji Menu] (v1.8) Initializing...')
emojiMenu()
console.log('[TTVEmoji Menu] (v1.8) Done!')
