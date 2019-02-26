import random
import time


class Bot:
    def __init__(self):
        self.board = []

    def make_move(self):
        time.sleep(random.randint(0, 2))
        return random.randint(0, 6)

    def print_board(self):
        print("[+] Current Board:")
        for row in self.board:
            for column in row:
                print(column, end="")
            print()
