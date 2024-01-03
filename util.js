'use strict'
var gInterval
var gStartTime
var gTimerRunning = false
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function createMat(ROWS, COLS) {
  const mat = []
  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push('')
    }
    mat.push(row)
  }
  return mat
}
function copyMat(mat) {
  var newMat = []
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = []
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j]
    }
  }
  return newMat
}
function startTimer() {
  gStartTime = performance.now()
  gInterval = setInterval(() => {
    const elapsedTime = (performance.now() - gStartTime) / 1000
    const formattedTime = elapsedTime.toFixed(0)
    const elTimer = document.querySelector('.timer-value')
    elTimer.innerText = formattedTime
    gGame.secsPassed = +elTimer.innerText
  }, 1000)
}
function resetTimer() {
  clearInterval(gInterval)
  gStartTime = null
  gTimerRunning = false
  const elTimer = document.querySelector('.timer-value')
  elTimer.innerText = 0
}
function cellColor() {
  const cellColor = document.querySelectorAll('.content')
  for (var i = 0; i < cellColor.length; i++) {
    const cell = cellColor[i]
    switch (cell.innerText) {
      case '1':
        cell.style.color = 'blue'
        cell.style.fontSize = `30px`
        break
      case '2':
        cell.style.color = 'green'
        cell.style.fontSize = `30px`
        break
      case '3':
        cell.style.color = 'red'
        cell.style.fontSize = `30px`
        break
      case '4':
        cell.style.color = 'purple'
        cell.style.fontSize = `30px`
        break
      case '5':
        cell.style.color = 'maroon'
        cell.style.fontSize = `30px`
        break
      case '6':
        cell.style.color = 'turquoise'
        cell.style.fontSize = `30px`
        break
      case '7':
        cell.style.color = 'black'
        cell.style.fontSize = `30px`
        break
      case '8':
        cell.style.color = 'grey'
        cell.style.fontSize = `30px`
        break
      case MINE:
        cell.style.fontSize = `30px`
        break
    }
  }
}
function updateLiveCount() {
  var livesCount = []
  livesCount.push(gGame.livesCount)
  console.log(livesCount)
}
