/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player{
  constructor(col1, col2){
    this.p1 = col1;
    this.p2 = col2;
  }
  setColor() {
    document.getElementsByClassName("p1").style.backgroundColor = this.p1;
    document.getElementsByClassName("p2").style.backgroundColor = this.p2;
  }
}

let players = new Player('orange', 'teal');



class Game{
  constructor(W=7,H=6){
    this.WIDTH=W;
    this.HEIGHT=H;
    this.board=[];
    this.currPlayer=1;
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  
  /** makeHtmlBoard: make HTML table and row of column tops. */
  
   makeHtmlBoard() {
    
    const boardHTML = document.getElementById("board");
    boardHTML.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", (evt)=>this.handleClick(evt));
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    boardHTML.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }
      boardHTML.append(row);
    }
  }
  
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  
   findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  
  /** placeInTable: update DOM to place piece into HTML board */
  
   placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    // piece.setAttribute('id',`p${this.currPlayer}`);
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
    // players.setColor();

  }
  
  /** endGame: announce game end */
  
   endGame(msg) {
    alert(msg);
  }
  
  /** handleClick: handle click of column top to play piece */
  
   handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = newGame.findSpotForCol(x);
    if (y === null) {
      return;
    }
    

  
    // place piece in this.board and add to HTML table
    this.board[y][x] = this.currPlayer;
   
    this.placeInTable(y, x);
  
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      startGame();     
      return this.endGame("Tie!");
    }
  
    // check for win
    if (this.checkForWin()) {
      startGame();      
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
  
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
  
  /** checkForWin: check this.board cell-by-cell for "does a win start here?" */
  
   checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
    let newWin=_win.bind(this);

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (newWin(horiz) || newWin(vert) || newWin(diagDR) || newWin(diagDL)) {
          return true;
        }
      }
    }
  }
  
}

let newGame;


function startGame() {
  newGame = new Game();

  newGame.makeBoard();
  newGame.makeHtmlBoard();

}

let startButton = document.getElementById('start')
startButton.addEventListener("click", ()=>startGame());
