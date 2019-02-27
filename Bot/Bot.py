import random
import time

from Player import Player


class Bot(Player):
    def __init__(self):
        super(Bot, self).__init__()

    @staticmethod
    def make_move():
        """
        Return a column to insert player token into.

        Returns a column to insert the player token into, this column is
        determined based on the bot logic and the current board state.
        """
        time.sleep(random.randint(0, 1) + .5)
        return random.randint(0, 6)

    def print_board(self):
        print("[*] Current Board:")
        for row in self.board:
            print("|" + "|".join(row) + "|")
