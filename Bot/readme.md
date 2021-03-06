# Sample Connect Four Bot

This is a sample bot to be used for the challenge. Actual bot code will be put into the [bot.py](bot.py) file. [main.py](main.py) is for interfacing with the server, challengers making the bot should not have to modify the code in `main.py`.

The bot's entry point is the function `make_move()` found in the `Bot` class. For this sample bot a random number is returned as well as a short sleep.

# Setup

You may or may not want to setup a virtual environment. To setup an environment, there are many ways.
The easiest way is in a terminal:

```bash
python -m venv venv
```

This creates a virtual environment named `venv`.

You can then activate this environment by typing:

```bash
./venv/Scripts/activate
```

_If on Windows_

With your environment active, _if you chose to_, install the needed websocket dependency.

```bash
pip install -r requirements.txt
```

## PyCharm

If you chose to use PyCharm for development, it will create an environment for you and also notice the `requirements.txt` file. The IDE will handle setup for you if you follow the prompts it shows.

# Running

You can run this in two ways. An AI player or a human player.

## AI player

To run the bot, in a terminal run the following command:

```bash
python main.py
```

## Human Player

You can also play yourself if you add `human` as a command line argument. In a terminal:

```bash
python main.py human
```

This allows you to play against your bot or others.
