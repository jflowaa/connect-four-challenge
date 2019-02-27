from ws4py.client.threadedclient import WebSocketClient
import json
import sys

from bot import Bot
from human import Human

SERVER_URL = "ws://127.0.0.1:3000/"


class ConnectFourClient(WebSocketClient):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if len(sys.argv) > 1 and sys.argv[1] == "human":
            self.bot = Human()
        else:
            self.bot = Bot()

    def opened(self):
        print("[*] Connected to server")
        payload = {"command": "init"}
        self.send(json.dumps(payload))

    def closed(self, code, reason=None):
        print("[!] Lost connection to server\n{}: {}".format(code, reason))

    def received_message(self, msg):
        try:
            payload = json.loads(str(msg))
            command = payload.get("command")
            if "token" == command:
                if payload.get("token"):
                    self.bot.token = payload.get("token")
                else:
                    print("[!] Max players joined. Closing...")
                    sys.exit()
            if "waiting" == command:
                player = payload.get("player")
                if self.bot.token == player:
                    print("[+] Player's turn")
                    self.bot.board = payload.get("board")
                    self.bot.print_board()
                    column = self.bot.make_move()
                    self.send(json.dumps(
                        {"command": "move", "player": self.bot.token, "column": column}))
            if "winner" == command:
                player = payload.get("player")
                if self.bot.token == player:
                    print("[+] Player won")
                else:
                    print("[+] Player lost")
                sys.exit()
        except TypeError:
            print("[!] Unexpected message from server: {}".format(msg))
            sys.exit()


if __name__ == '__main__':
    try:
        ws = ConnectFourClient(SERVER_URL, protocols=['http-only', 'chat'])
        ws.connect()
        ws.run_forever()
    except KeyboardInterrupt:
        print("[*] Closing...")
        ws.close()
