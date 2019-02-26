var emptyToken = "e";
var playerOneToken = "x";
var playerTwoToken = "o";

module.exports = Object.freeze({
  HOST: "0.0.0.0",
  PORT: 3000,
  EMPTY_TOKEN: emptyToken,
  PLAYER_ONE_TOKEN: playerOneToken,
  PLAYER_TWO_TOKEN: playerTwoToken,
  ROWS: 6,
  COLUMNS: 7,
  TOKEN_COLOR_MAP: {
    "": "Ongoing",
    [emptyToken]: "white",
    [playerOneToken]: "black",
    [playerTwoToken]: "red"
  }
});
