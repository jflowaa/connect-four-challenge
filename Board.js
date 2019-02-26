const ConfigConstants = require("./ConfigConstants.js");

module.exports = class Board {
  constructor() {
    this.board = this.createBoard();
    this.radius = 40;
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

  move(piece, column) {
    for (var i = ConfigConstants.ROWS - 1; i >= 0; i--) {
      if (this.board[i][column] === ConfigConstants.EMPTY_TOKEN) {
        this.board[i][column] = piece;
        break;
      }
    }
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
};
