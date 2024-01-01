'use strict'
var gClick = true

function onCellClicked(elCell, i, j) {
  const elSpan = document.querySelector('.cover')
  const currCell = gBoard[i][j]

  if (currCell.isShown || currCell.isMarked || !gGame.isOn) return

  if (!gTimerRunning) {
    startTimer()
    gTimerRunning = true
  }

  currCell.isShown = true
  gGame.shownCount++
  console.log('showncount', gGame.shownCount)
  elCell.classList.add('shown')

  const cellContent = elCell.querySelector('.content')

  cellContent.classList.remove('hidden')

  if (currCell.isMine) {
    if (gGame.shownCount === 1) {
      play()
      return
    }

    gameOver()
  } else {
    if (currCell.minesAroundCount === 0) {
      expandShown(gBoard, i, j)
    }

    victory()
  }
}

function expandShown(board, i, j) {
  for (var row = i - 1; row <= i + 1; row++) {
    for (var col = j - 1; col <= j + 1; col++) {
      if (row >= 0 && row < gLevel.SIZE && col >= 0 && col < gLevel.SIZE) {
        const neighborCell = board[row][col]
        const cellSelector = `.${getClassName({ i: row, j: col })}`
        const neighborCellElement = document.querySelector(cellSelector)

        if (!neighborCell.isShown && !neighborCell.isMarked) {
          onCellClicked(neighborCellElement, row, col)

          onBtnClick(neighborCellElement, row, col)
        }
      }
    }
  }
}

function onBtnClick(elBtn, i, j) {
  var cell = gBoard[i][j]
  if (cell.isMarked || !gGame.isOn) return
  if (elBtn) {
    const elSpan = elBtn.querySelector('.cover')

    if (elSpan && elSpan.style.display !== 'none') {
      elSpan.style.display = 'none'
    } else {
      elBtn.classList.add('hidden')
    }
  }
}
function onMark(event, i, j, elCell) {
  event.preventDefault()
  const elSpan = document.querySelector('.cover')
  var cell = gBoard[i][j]

  if (!cell.isShown && elSpan.classList.contains('cover')) {
    cell.isMarked = !cell.isMarked
    elCell.innerHTML = cell.isMarked ? MARK : EMPTY
    cell.isMarked ? gGame.markedCount++ : gGame.markedCount--
    console.log('markcount', gGame.markedCount)
    victory()
  }
}

function changeStage(elBtn) {
  const elCover = document.querySelector('.cover')
  if (elBtn.classList.contains('button1')) {
    const stage1 = elBtn.innerText
    gLevel.SIZE = 4
    gLevel.MINES = 2
  }
  if (elBtn.classList.contains('button2')) {
    const stage2 = elBtn.innerText
    gLevel.SIZE = 8
    gLevel.MINES = 14
  }
  if (elBtn.classList.contains('button3')) {
    const stage3 = elBtn.innerText
    gLevel.SIZE = 12
    gLevel.MINES = 32
  }
  onInit()
}
