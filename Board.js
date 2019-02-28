const ConfigConstants = require("./ConfigConstants.js");

module.exports = class Board {
  constructor() {
    this.board = this.createBoard();
    this.radius = 40;
    this.winningToken = "";
  }

  reset() {
    this.winningToken = "";
    this.board = this.createBoard();
  }

  createBoard() {
    var board = [];
    for (var i = 0; i < ConfigConstants.ROWS; i++) {
      var row = [];
      for (var j = 0; j < ConfigConstants.COLUMNS; j++) {
        row.push(ConfigConstants.EMPTY_TOKEN);
      }
      board.push(row);
    }
    return board;
  }

  move(token, column) {
    for (var i = ConfigConstants.ROWS - 1; i >= 0; i--) {
      if (this.board[i][column] === ConfigConstants.EMPTY_TOKEN) {
        this.board[i][column] = token;
        return true;
      }
    }
    return false;
  }

  createBoardSvg() {
    var diameter = 2 * this.radius;
    var svg = `<svg height="${ConfigConstants.ROWS *
      diameter}" width="${ConfigConstants.COLUMNS *
      diameter}"><rect width="100%" height="100%" fill="blue"/>`;

    for (var i = 0; i < ConfigConstants.ROWS; i++) {
      for (var j = 0; j < ConfigConstants.COLUMNS; j++) {
        var piece = this.board[i][j];
        var color = ConfigConstants.TOKEN_COLOR_MAP[piece];
        var cx = j * diameter + this.radius;
        var cy = i * diameter + this.radius;
        svg += `<circle cx="${cx}" cy="${cy}" r="${this.radius *
          0.75}" fill="${color}"/>`;
      }
    }
    svg += "</svg>";
    return svg;
  }

  checkForTie() {
    for (var row = 0; row < ConfigConstants.ROWS; row++) {
      for (var column = 0; column < ConfigConstants.COLUMNS; column++) {
        if (this.board[row][column] === ConfigConstants.EMPTY_TOKEN) {
          return false;
        }
      }
    }
    return true;
  }

  checkWinner(token) {
    for (var row = 0; row < ConfigConstants.ROWS; row++) {
      for (var column = 0; column < ConfigConstants.COLUMNS; column++) {
        if (
          column + 3 < ConfigConstants.COLUMNS &&
          token == this.board[row][column] &&
          token == this.board[row][column + 1] &&
          token == this.board[row][column + 2] &&
          token == this.board[row][column + 3]
        )
          return true;
        if (row + 3 < ConfigConstants.ROWS) {
          if (
            token == this.board[row][column] &&
            token == this.board[row + 1][column] &&
            token == this.board[row + 2][column] &&
            token == this.board[row + 3][column]
          )
            return true;
          if (
            column + 3 < ConfigConstants.COLUMNS &&
            token == this.board[row][column] &&
            token == this.board[row + 1][column + 1] &&
            token == this.board[row + 2][column + 2] &&
            token == this.board[row + 3][column + 3]
          )
            return true;
          if (
            column - 3 >= 0 &&
            token == this.board[row][column] &&
            token == this.board[row + 1][column - 1] &&
            token == this.board[row + 2][column - 2] &&
            token == this.board[row + 3][column - 3]
          )
            return true;
        }
      }
    }
  }
};
