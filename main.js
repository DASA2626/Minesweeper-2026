"use strict";

const WOOL = "⬜️";
const FLAG = "🚩";
const BOOMS = "💣";

var gBoard;
var gStartTime;
var gTimerInterval;
var gIsFirstClick = true;

const gLevel = {
  SIZE: 8,
  MINES: 4,
};

const gGame = {
  isOn: false,
  revealedCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  setMinesNegsCount();
  
 
  gGame.isOn = false;
  gGame.revealedCount = 0;
  gGame.markedCount = 0;
  gIsFirstClick = true;
  
  if (gTimerInterval) clearInterval(gTimerInterval);
  document.querySelector(".timer").innerText = "0.00";
  
  var elModal = document.querySelector('.game-over');
  elModal.style.display = 'none';
  document.querySelector('.res').style.display = 'none';
}



function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  setMines(board);
  return board;
}

function renderBoard(board) {
  var strHTML = "<table><tbody>";

  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var cellContent = "";

      if (cell.isRevealed) {
        if (cell.isMine) {
          cellContent = BOOMS;
        } else if (cell.minesAroundCount > 0) {
          cellContent = cell.minesAroundCount;
        }
       } else if (cell.isMarked) {
        cellContent = FLAG;
      }

      strHTML += `<td class="cell cell-${i}-${j} ${cell.isRevealed ? 'revealed' : ''}" 
                      onclick="onCellClicked(this,${i},${j})" 
                      oncontextmenu="onCellMarked(event,this,${i},${j})">${cellContent}</td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";

  document.querySelector(".board-container").innerHTML = strHTML;
}

function setMines(board) {
  var counterBooms = 0;
  while (counterBooms < gLevel.MINES) {
    var row = Math.floor(Math.random() * gLevel.SIZE);
    var col = Math.floor(Math.random() * gLevel.SIZE);
    if (!board[row][col].isMine) {
      counterBooms++;
      board[row][col].isMine = true;
    }
  }
  console.log(board);
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      var counter = 0;

      if (cell.isMine) continue;

      for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
          if (x === i && y === j) continue;
          if (x < 0 || x >= gBoard.length) continue;
          if (y < 0 || y >= gBoard[0].length) continue;
          if (gBoard[x][y].isMine) counter++;
        }
      }
      cell.minesAroundCount = counter;
    }
  }
}


function onCellClicked(elCell, i, j) {
  var cell = gBoard[i][j];

  if (cell.isMarked || cell.isRevealed || !gGame.isOn && !gIsFirstClick) return;


  if (gIsFirstClick) {
    gGame.isOn = true;
    gIsFirstClick = false;
    startTimer();
  }

  cell.isRevealed = true;
  gGame.revealedCount++;

  if (cell.isMine) {
    gameOver(false);
    return;
  }

  if (cell.minesAroundCount === 0) {
    expandShown(i, j);
  }

  renderBoard(gBoard);
  checkVictory();
}



function onCellMarked(event, elCell, i, j) {
  event.preventDefault();

  var cell = gBoard[i][j];
  if (cell.isRevealed) return;

  cell.isMarked = !cell.isMarked;
  gGame.markedCount += cell.isMarked ? 1 : -1;

  renderBoard(gBoard);
}


function checkVictory() {
  var totalCells = gLevel.SIZE * gLevel.SIZE;
  var safeCells = totalCells - gLevel.MINES;

  if (gGame.revealedCount === safeCells) {
    gameOver(true);
  }
}

function gameOver(isVictory) {
  gGame.isOn = false;
  clearInterval(gTimerInterval);

  // חשיפת כל המוקשים
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        gBoard[i][j].isRevealed = true;
      }
    }
  }
  
  renderBoard(gBoard);

  var elModal = document.querySelector('.game-over');
  elModal.innerText = isVictory ? '🎉 YOU WIN! 🎉' : '💥 GAME OVER! 💥';
  elModal.style.display = 'block';
  document.querySelector('.res').style.display = 'block';
}


function startTimer() {
  gStartTime = Date.now();

  gTimerInterval = setInterval(() => {
    var timeDiff = Date.now() - gStartTime;
    var seconds = (timeDiff / 1000).toFixed(2);
    document.querySelector(".timer").innerText = seconds;
  }, 100);
}
