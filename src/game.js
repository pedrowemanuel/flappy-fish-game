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
  spriteX: 4,
  spriteY: 610,
  width: 707,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  update() {
    const floorMovement = 1.7;
    const repeatIn = this.width / 1.1;
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
    // context.drawImage(
    //   sprites,
    //   this.spriteX,
    //   this.spriteY,
    //   this.width,
    //   this.height,
    //   this.x + this.width,
    //   this.y,
    //   this.width,
    //   this.height
    // );
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
  medalSize: 41,
  medals: {
    steel: {
      x: 48,
      y: 79,
    },
    bronze: {
      x: 48,
      y: 124,
    },
    silver: {
      x: 0,
      y: 79,
    },
    gold: {
      x: 0,
      y: 124,
    },
  },
  draw(score = 0, bestScore = 0) {
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

    const drawMedal = (score, context) => {
      let medal = this.medals.steel;

      if (score >= 5 && score < 10) {
        medal = this.medals.bronze;
      } else if (score >= 10 && score < 20) {
        medal = this.medals.silver;
      } else if (score >= 20) {
        medal = this.medals.gold;
      }

      context.drawImage(
        sprites,
        medal.x,
        medal.y,
        this.medalSize,
        this.medalSize,
        this.x + 24,
        this.y + 89,
        this.medalSize,
        this.medalSize
      );
    };

    const drawScore = (score, context) => {
      context.font = "25px 'VT323'";
      context.textAlign = "right";
      context.fillStyle = "#CD993C";
      context.fillText(`${score}`, this.x + this.width - 23, this.y + 93);
    };

    const drawBestScore = (bestScore, context) => {
      context.font = "25px 'VT323'";
      context.textAlign = "right";
      context.fillStyle = "#CD993C";
      context.fillText(`${bestScore}`, this.x + this.width - 23, this.y + 135);
    };

    drawScore(score, context);
    drawBestScore(bestScore, context);
    drawMedal(score, context);
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

    const isInThePipeArea =
      (flappyFish.x + flappyFish.width - 5 >= pairPipes.x) &
      (flappyFish.x < pairPipes.x + this.width);

    if (isInThePipeArea) {
      const collidedOnTop =
        flappyHead + collisionAdjustment <= pairPipes.topPipe.y;
      if (collidedOnTop) {
        return true;
      }

      const collidedOnBotton =
        flappyFoot - collisionAdjustment >= pairPipes.bottomPipe.y;
      if (collidedOnBotton) {
        return true;
      }
    }

    return false;
  },
  flappyPassedThePipeArea(pairPipes, flappyFish) {
    const passedThePipeArea =
      flappyFish.x + flappyFish.width - 5 >= pairPipes.x &&
      flappyFish.x === pairPipes.x + this.width + 4;

    if (passedThePipeArea) {
      return true;
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
      return;
    }

    if (frames === difficulties.medium) {
      this.space = this.space - 5;
      return;
    }

    if (frames === difficulties.difficult) {
      this.space = this.space - 5;
      return;
    }

    if (frames === difficulties.veryDifficult) {
      this.space = this.space - 5;
      return;
    }
  },
  update(
    frames = 0,
    flappyFish = null,
    gameOver = () => { },
    makePoint = () => { }
  ) {
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

      if (this.flappyPassedThePipeArea(pair, flappyFish)) {
        console.log("c");
        makePoint();
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
  update() {
    this.score++;
  },
});

const createVolumeButton = ({ context, sprites }) => ({
  modes: {
    on: {
      spriteX: 134,
      spriteY: 363,
    },
    off: {
      spriteX: 134,
      spriteY: 393,
    },
  },
  width: 37.5,
  height: 30,
  x: canvas.width - 40,
  y: 10,
  currentMode: 'on',
  changeMode() {
    this.currentMode = this.currentMode === 'on' ? 'off' : 'on';
  },
  update() {
  },
  draw(mode) {
    this.currentMode = mode;
    const { spriteX, spriteY } = this.modes[this.currentMode];
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
});

const game = (settings) => {
  const globals = {};

  const setBestScore = (score = 0) => {
    localStorage.setItem("flappyFishGameBestScore", score);
  };

  const getBestScore = () => {
    return localStorage.getItem("flappyFishGameBestScore");
  };

  const setSoundMode = (mode) => {
    localStorage.setItem("flappyFishGameSoundMode", mode);
  };

  const getSoundMode = () => {
    return localStorage.getItem("flappyFishGameSoundMode");
  };

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

  const tap = (e) => {
    if (activeScreen.tap != undefined) {
      activeScreen.tap(e);
    }
  };

  const listenEvents = () => {
    document.querySelector("canvas").addEventListener("click", tap);
    window.addEventListener("keyup", tap);
  };

  settings.context = canvas.getContext("2d");

  const background = createBackground(settings);
  const messageGetReady = createMessageGetReady(settings);
  const volumeButton = createVolumeButton(settings);
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

        const soundMode = getSoundMode();

        volumeButton.draw(soundMode);
      },
      tap: (e) => {
        frames = 0;

        const { offsetX, offsetY } = e;

        // verificando se clicou no botao de volume
        if ((offsetY >= 10 && offsetY <= 10 + volumeButton.height)
          && (offsetX >= volumeButton.x && offsetX <= volumeButton.x + volumeButton.width)) {

          volumeButton.changeMode();
          setSoundMode(volumeButton.currentMode);
        } else {
          changeScreen(screens.GAME);
        }

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

        globals.pipes.update(
          frames,
          globals.flappyFish,
          () => {
            gameOver();
          },
          () => {
            globals.scoreBoard.update();
            settings.sounds.point.play();
          }
        );

        globals.floor.update();
        globals.flappyFish.update();
      },
    },
    GAME_OVER: {
      draw: () => {
        const score = globals.scoreBoard.score;
        let bestScore = getBestScore();

        if (score > bestScore) {
          setBestScore(score);
          bestScore = score;
        }

        messageGameOver.draw(score, bestScore);
      },
      tap: (e) => {
        changeScreen(screens.START);
      },
      update: () => { },
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
      if (getBestScore() === null) {
        setBestScore(0);
      }

      if (getSoundMode() === null) {
        setSoundMode('on');
      }

      changeScreen(screens.START);
      loop();
      listenEvents();
    },
  };
};
