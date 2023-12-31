'use strict'
const MINE = '🍬'
const EMPTY = ''
const MARK = '🍫'
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
  renderBoard(gBoard)
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
      strHTML += `<button onclick="onBtnClick(this,${i},${j})" oncontextmenu="onMark(event,${i},${j},this); return false;" class="cover"></button>`
      strHTML += `\n</td>`
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
      // console.log(board[i][j].minesAroundCount)
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

    // Check if the position is already assigned as a mine
    if (!minesPlaced.includes(minePosition)) {
      board[randRow][randCol].isMine = true
      minesPlaced.push(minePosition)
      mineCount++
    }
  }
}
function gameOver() {
  const game = document.querySelector('.game-over')
  gGame.isOn = false
  game.innerText += 'defeat!'
}

function victory() {
  const game = document.querySelector('.game-over')
  const totalCells = gLevel.SIZE ** 2

  // Check if all mines are flagged and all other cells are shown
  if (
    gGame.markedCount === gLevel.MINES &&
    gGame.shownCount + gGame.markedCount === totalCells
  ) {
    game.innerText = 'VICTORY!'
  }

  gGame.isOn = false
}
