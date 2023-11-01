const collided = (element, floor) => {
  const elementY = element.y + element.height;

  if (elementY >= floor.y) {
    return true;
  }

  return false;
};

const createBackground = ({ canvas, context, sprites }) => ({
  spriteX: 387,
  spriteY: 0,
  width: 320,
  height: 480,
  x: 0,
  y: 0,
  draw() {
    context.fillStyle = "#3E6090";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
});

const createFloor = ({ canvas, context, sprites }) => ({
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  update() {
    const floorMovement = 1.7;
    const repeatIn = this.width / 1.7;
    const movement = this.x - floorMovement;
    this.x = movement % repeatIn;
  },
  draw() {
    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x + this.width - 23,
      this.y,
      this.width,
      this.height
    );
  },
});

const createMessageGetReady = ({ canvas, context, sprites }) => ({
  spriteX: 130,
  spriteY: 0,
  width: 174,
  height: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
});

const createMessageGameOver = ({ canvas, context, sprites }) => ({
  spriteX: 134,
  spriteY: 153,
  width: 226,
  height: 200,
  x: canvas.width / 2 - 226 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
});

const createFlappyFish = ({ context, sprites }) => ({
  spriteX: 0,
  spriteY: 0,
  width: 32,
  height: 25,
  x: 10,
  y: 50,
  speed: 0,
  gravity: 0.1,
  impulseSize: 3.4,
  movements: [
    { spriteX: 0, spriteY: 0 },
    { spriteX: 0, spriteY: 26 },
    { spriteX: 0, spriteY: 52 },
  ],
  currentFrame: 0,
  setCurrentFrame(frames = 0) {
    const frameRange = 10;
    const passedTheBreak = frames % frameRange === 0;

    if (passedTheBreak) {
      const quantityOfMovements = this.movements.length;
      this.currentFrame = frames % quantityOfMovements;
    }
  },
  update() {
    this.speed += this.gravity;
    this.y += this.speed;
  },
  draw(frames = 0) {
    this.setCurrentFrame(frames);
    const { spriteX, spriteY } = this.movements[this.currentFrame];
    context.drawImage(
      sprites,
      spriteX,
      spriteY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  swimUp() {
    this.speed = -this.impulseSize;
  },
});

const createPipes = ({ canvas, context, sprites }) => ({
  width: 52,
  height: 283,
  bottom: {
    spriteX: 0,
    spriteY: 169,
  },
  top: {
    spriteX: 52,
    spriteY: 169,
  },
  minSpace: 80,
  space: 100,
  pairs: [],
  intervalFrames: 110,
  draw() {
    this.pairs.forEach((pair) => {
      const yRandom = pair.y;

      const topPipeX = pair.x;
      const topPipeY = 0 + yRandom;
      context.drawImage(
        sprites,
        this.top.spriteX,
        this.top.spriteY,
        this.width,
        this.height,
        topPipeX,
        topPipeY,
        this.width,
        this.height
      );

      const bottomPipeX = pair.x;
      const bottomPipeY = this.height + this.space + yRandom;
      context.drawImage(
        sprites,
        this.bottom.spriteX,
        this.bottom.spriteY,
        this.width,
        this.height,
        bottomPipeX,
        bottomPipeY,
        this.width,
        this.height
      );

      pair.topPipe = {
        x: topPipeX,
        y: this.height + topPipeY,
      };

      pair.bottomPipe = {
        x: bottomPipeX,
        y: bottomPipeY,
      };
    });
  },
  collidedWithTheFlappyFish(pairPipes, flappyFish) {
    const flappyHead = flappyFish.y;
    const flappyFoot = flappyFish.y + flappyFish.height;
    const collisionAdjustment = 7;

    if (flappyFish.x + flappyFish.width - 5 >= pairPipes.x) {
      if (flappyHead + collisionAdjustment <= pairPipes.topPipe.y) {
        return true;
      }

      if (flappyFoot - collisionAdjustment >= pairPipes.bottomPipe.y) {
        return true;
      }
    }

    return false;
  },
  changeDifficult(frames) {
    const intervalToOvertakeAPipe = 75;
    const difficulties = {
      easy: this.intervalFrames * 5 + intervalToOvertakeAPipe,
      medium: this.intervalFrames * 10 + intervalToOvertakeAPipe,
      difficult: this.intervalFrames * 20 + intervalToOvertakeAPipe,
      veryDifficult: this.intervalFrames * 30 + intervalToOvertakeAPipe,
    };

    if (frames === difficulties.easy) {
      this.space = this.space - 5;
    }

    if (frames === difficulties.medium) {
      this.space = this.space - 5;
    }

    if (frames === difficulties.difficult) {
      this.space = this.space - 5;
    }

    if (frames === difficulties.veryDifficult) {
      this.space = this.space - 5;
    }
  },
  update(frames = 0, flappyFish = null, gameOver = () => {}) {
    const passedIntervalFrames = frames % this.intervalFrames === 0;

    if (passedIntervalFrames) {
      this.pairs.push({
        x: canvas.width,
        y: -40 * (Math.random() * 5 + 1),
      });
    }

    this.pairs.forEach((pair) => {
      pair.x = pair.x - 2;

      if (this.collidedWithTheFlappyFish(pair, flappyFish)) {
        gameOver();
      }

      if (pair.x + this.width <= 0) {
        this.pairs.shift();
      }
    });

    this.changeDifficult(frames);
  },
});

const createScoreBoard = ({ canvas, context }) => ({
  score: 0,
  x: canvas.width - 10,
  y: 35,
  draw() {
    context.font = "35px 'VT323'";
    context.textAlign = "right";
    context.fillStyle = "white";
    context.fillText(`${this.score}`, this.x, this.y);
  },
  update(frames = 0) {
    const intervalFrames = 20;
    const passedIntervalFrames = frames % intervalFrames === 0;

    if (passedIntervalFrames) {
      this.score++;
    }
  },
});

const game = (settings) => {
  const globals = {};
  let frames = 0;

  let activeScreen = {};
  const changeScreen = (screen) => {
    activeScreen = screen;

    if (screen.initialize) {
      screen.initialize();
    }
  };

  const gameOver = () => {
    settings.sounds.hit.play();

    changeScreen(screens.GAME_OVER);
  };

  const tap = () => {
    if (activeScreen.tap != undefined) {
      activeScreen.tap();
    }
  };

  const listenEvents = () => {
    document.querySelector("canvas").addEventListener("click", tap);
    window.addEventListener("keyup", tap);
  };

  settings.context = canvas.getContext("2d");

  const background = createBackground(settings);
  const messageGetReady = createMessageGetReady(settings);
  const messageGameOver = createMessageGameOver(settings);

  const screens = {
    START: {
      initialize: () => {
        globals.floor = createFloor(settings);
        globals.flappyFish = createFlappyFish(settings, globals.floor);
        globals.pipes = createPipes(settings);
      },
      draw: () => {
        background.draw();
        globals.floor.draw();
        globals.flappyFish.draw(frames);
        messageGetReady.draw();
      },
      tap: () => {
        changeScreen(screens.GAME);
      },
      update: () => {
        globals.floor.update();
      },
    },
    GAME: {
      initialize: () => {
        globals.scoreBoard = createScoreBoard(settings);
      },
      draw: () => {
        background.draw();
        globals.pipes.draw();
        globals.floor.draw();
        globals.flappyFish.draw(frames);
        globals.scoreBoard.draw();
      },
      tap: () => {
        settings.sounds.up.play();

        globals.flappyFish.swimUp();
      },
      update: () => {
        if (collided(globals.flappyFish, globals.floor)) {
          gameOver();
          return;
        }

        globals.pipes.update(frames, globals.flappyFish, () => {
          gameOver();
        });

        globals.floor.update();
        globals.flappyFish.update();
        globals.scoreBoard.update(frames);
      },
    },
    GAME_OVER: {
      draw: () => {
        messageGameOver.draw();
      },
      tap: () => {
        frames = 0;
        changeScreen(screens.START);
      },
      update: () => {},
    },
  };

  function loop() {
    activeScreen.update();
    activeScreen.draw();

    frames += 1;
    requestAnimationFrame(loop);
  }

  return {
    start: () => {
      changeScreen(screens.START);
      loop();
      listenEvents();
    },
  };
};
