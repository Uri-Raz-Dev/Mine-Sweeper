'use strict'
const MINE = '🍬'
const EMPTY = ''
const MARK = '🍫'
const GAME_OVER = '😢'
const VICTORY = '😎'
const GAME_ON = '😃'
var gBoard
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  countCells: 0,
}

var gLevel = {
  SIZE: 4,
  MINES: 2,
}
function onInit() {
  resetTimer()
  gGame.isOn = true

  gBoard = createBoard()
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.countCells = 0
  gGame.secsPassed = 0
  renderBoard(gBoard)
  const elSpan = document.querySelector('.game-condition')
  elSpan.innerText = GAME_ON
}

function createBoard() {
  const board = createMat(gLevel.SIZE, gLevel.SIZE)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j] = {
        minesAroundCount: setMinesNegsCount({ i, j }, board),
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  // addMines(board)
  board[0][0].isMine = true
  board[1][2].isMine = true
  calculateMinesAroundCount(board)
  return board
}
function renderBoard(board) {
  var strHTML = ''
  const elBoard = document.querySelector(`.board`)
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      var cellClass = getClassName({ i, j })

      strHTML += `\t<td onClick="onCellClicked(this,${i},${j})" class="cell ${cellClass}">`
      strHTML += `<span class="content hidden">`

      if (currCell.isMine) {
        cellClass += ` mine`
        strHTML += MINE
      } else {
        strHTML +=
          currCell.minesAroundCount !== 0 ? currCell.minesAroundCount : EMPTY
      }

      strHTML += `</span>`
      strHTML += `<button onclick="onBtnClick(this,${i},${j})" oncontextmenu="onMark(event,${i},${j},this); return false;"
       class="cover cover${i}-${j} content"></button>`
      strHTML += `\n</td>`
      gGame.countCells++
      cellColor(i, j)
    }
    strHTML += `</tr>\n`
  }
  elBoard.innerHTML = strHTML
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      cellColor(i, j)
    }
  }
}
function setMinesNegsCount(pos, board) {
  var count = 0
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === pos.i && j === pos.j) continue
      if (board[i][j].isMine) count++
    }
  }

  return count
}

function getClassName(pos) {
  const cellClass = `cell${pos.i}-${pos.j}`
  return cellClass
}

function calculateMinesAroundCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j].minesAroundCount = setMinesNegsCount({ i, j }, board)
    }
  }
}

function addMines(board) {
  var mineCount = 0
  var minesPlaced = []

  while (mineCount < gLevel.MINES) {
    var randRow = getRandomInt(0, board.length - 1)
    var randCol = getRandomInt(0, board[randRow].length - 1)

    var minePosition = randRow + ',' + randCol

    if (!minesPlaced.includes(minePosition)) {
      board[randRow][randCol].isMine = true
      minesPlaced.push(minePosition)
      mineCount++
    }
  }
}
function gameOver() {
  const game = document.querySelector('.game-condition')
  if (gGame.isOn) {
    game.innerText = GAME_OVER

    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[i].length; j++) {
        const cell = gBoard[i][j]
        const elCell = document.querySelector(`.cell${i}-${j}`)
        const elCover = document.querySelector(`.cover${i}-${j}`)
        const elMine = elCell.querySelector('.content')

        if (cell.isMine) {
          elMine.classList.remove('hidden')
          elCover.classList.add('hidden')
          elMine.style.backgroundColor = 'red'
          gGame.isOn = false
          clearInterval(gInterval)
        }
      }
    }
  }
}

function victory() {
  const game = document.querySelector('.game-condition')
  if (gGame.isOn) {
    if (
      gGame.markedCount === gLevel.MINES &&
      gGame.shownCount + gGame.markedCount === gGame.countCells
    ) {
      game.innerText = VICTORY
      gGame.isOn = false
      clearInterval(gInterval)
    }
  }
}
function generateNewBoard(board) {
  var newBoard = copyMat(board)
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < board[0].length; col++) {
      if (board[row][col] === MINE) {
        newBoard[row][col] = EMPTY
      }
      newBoard[row][col].minesAroundCount = setMinesNegsCount(
        { i: row, j: col },
        newBoard
      )
    }
  }
  removeMines(gBoard)
  addMines(newBoard)
  calculateMinesAroundCount(newBoard)
  return newBoard
}

function play() {
  gBoard = generateNewBoard(gBoard)
  renderBoard(gBoard)
}

function removeMines(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      board[i][j].isMine = false
    }
  }
}
