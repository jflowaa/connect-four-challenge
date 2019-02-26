const PlayerCommands = require("./PlayerCommands.js");
const PLAYER_ONE = "x";
const PLAYER_TWO = "o";
const MAX_PLAYERS_ERROR = "Only two players can join";

module.exports = class PlayerManager {
  constructor() {
    this.activePlayers = [];
    this.waitingOnPlayer = PLAYER_ONE;
  }

  broadcastWaitingMessage(expressWs) {
    expressWs.getWss("/").clients.forEach(client => {
      client.send(
        JSON.stringify({
          command: PlayerCommands.WAITING,
          player: this.waitingOnPlayer
        })
      );
    });
  }

  playerJoin() {
    if (this.activePlayers.length === 0) {
      this.activePlayers.push(PLAYER_ONE);
      return PLAYER_ONE;
    } else if (this.activePlayers.length === 1) {
      this.activePlayers.push(PLAYER_TWO);
      return PLAYER_TWO;
    } else {
      return MAX_PLAYERS_ERROR;
    }
  }

  swapWaitingOnPlayer() {
    if (this.waitingOnPlayer === PLAYER_ONE) {
      this.waitingOnPlayer = PLAYER_TWO;
    } else {
      this.waitingOnPlayer = PLAYER_ONE;
    }
  }

  isReady() {
    return this.activePlayers.length === 2;
  }

  clearPlayers() {
    this.activePlayers = [];
  }
};
