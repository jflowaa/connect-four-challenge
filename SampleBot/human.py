class Human:

    @staticmethod
    def make_move():
        return input("Enter Column: ")

    def print_board(self):
        print("[*] Current Board:")
        for row in self.board:
            print("|" + "|".join(row) + "|")
