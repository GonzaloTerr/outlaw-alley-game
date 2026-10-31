# Outlaw Alley

A Wild West action game for the browser, made with [Phaser](https://phaser.io). You walk through a western town, go into its buildings and fight bandits and a boss. It works on desktop and on phones.

This is a side project of mine. The game is playable, but it is not finished: it did not pass CrazyGames' review, and I want to keep improving it. This version started as "Outlaw Alley 2", and the plan is to join my three prototypes into one game, each one as a level.

## Built with

JavaScript and Phaser 3, with no build step.

## Run it locally

The game loads its files over HTTP, so open it through a small local server instead of opening `index.html` directly:

```bash
npx serve .
```

Then open the address it shows in your browser.

## How it is organized

- `game.js`: all the game logic
- `index.html`: the page that loads the game
- `arte/`: images
- `sonido/`: music and sound effects
- `fuente/`: the Rye font
- `lib/`: Phaser
- `planes/`: my working notes, in Spanish

## Plans

See [ROADMAP.md](ROADMAP.md).

## License

The code I wrote is under the [MIT License](LICENSE). These files have their own terms:

- **Images in `arte/`:** generated with AI image tools, under the terms of those tools.
- **Music:** ["Spaghetti Western"](https://opengameart.org/content/spaghetti-western) by Spring Spring, CC0.
- **Sound effects in `sonido/`:** free CC0 sounds from Freesound.
- **Rye font:** SIL Open Font License, see `fuente/OFL.txt`.
- **Phaser:** MIT License.
