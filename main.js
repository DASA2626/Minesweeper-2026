"use strict";

const WOOL = "⬜️";
const FLAG = "🚩";
const BOOMS = "💣";



var gBoard;
var gStartTime

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
   gameOver()
  var elModal = document.querySelector('.game-over')
  elModal.style.display = 'none'

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
      var cell = board[i][j]

      if (cell.isMine) {
        strHTML += `<td class="cell cell-${i}-${j}" 
                        onclick="onCellClicked(this,${i},${j})" 
                        oncontextmenu="onCellMarked(event,this,${i},${j})">${BOOMS}</td>`;
      } else if (cell.minesAroundCount > 0) {
        strHTML += `<td class="cell cell-${i}-${j}" 
                        onclick="onCellClicked(this,${i},${j})" 
                        oncontextmenu="onCellMarked(event,this,${i},${j})">${cell.minesAroundCount}</td>`;
      } else {
        strHTML += `<td class="cell cell-${i}-${j}" 
                        onclick="onCellClicked(this,${i},${j})" 
                        oncontextmenu="onCellMarked(event,this,${i},${j})"></td>`;
      }
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

      for (var x = i - 1; x <= i + 1; ++x) {
        for (var y = j - 1; y <= j + 1; ++y){
        if (x === i && y === j) continue
        if (x < 0 || x >= gBoard.length)continue 
        if (y < 0 || y >= gBoard[0].length)continue 
        if (gBoard[x][y].isMine) counter++;
      
      }
    }
    
    cell.minesAroundCount = counter;
    //  console.log(`תא [${i}][${j}]: ${counter} מוקש`);
  }
}
}


function onCellClicked(elCell,i, j) {
  var cell = gBoard[i][j]
  if (cell.isMine) {
    elCell.innerText = BOOMS
    console.log("BOOM!")
    
    gameOver()
  } else if (cell.minesAroundCount > 0) {
    elCell.innerText = cell.minesAroundCount
    console.log(cell.minesAroundCount);
  } else {
    elCell.innerText = ''
  }
  cell.isRevealed = true
}




function onCellMarked(event, elCell, i, j) {

  event.preventDefault()

  var cell = gBoard[i][j]

 
  cell.isMarked = !cell.isMarked

  if (cell.isMarked) {
    elCell.innerHTML = FLAG
  } else {
    elCell.innerHTML = WOOL
  }
}

function gameOver() {
  var elModal = document.querySelector('.game-over')
  elModal.style.display = 'block'
}



function startTimer() {
  gStartTime = Date.now();

  gTimerInterval = setInterval(() => {
    var timeDiff = Date.now() - gStartTime;

    var seconds = (timeDiff / 1000).toFixed(2);

    document.querySelector(".timer").innerText = seconds;
  }, 100);
}