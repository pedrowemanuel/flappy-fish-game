const collided = (element, floor) => {
  const elementY = element.y + element.height;

  if (elementY >= floor.y) {
    return true;
  }

  return false;
};

const createBackground = ({ canvas, context, sprites }) => ({
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#008EBA";
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

    context.drawImage(
      sprites,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height,
      this.x + this.width - 10,
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
  minSpace: 75,
  space: 100,
  pairs: [],
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

    if (flappyFish.x >= pairPipes.x) {
      if (flappyHead <= pairPipes.topPipe.y) {
        return true;
      }

      if (flappyFoot >= pairPipes.bottomPipe.y) {
        return true;
      }
    }

    return false;
  },
  update(frames = 0, flappyFish = null, gameOver = () => {}) {
    const intervalFrames = 100;
    const passedIntervalFrames = frames % intervalFrames === 0;

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

    changeScreen(screens.START);
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
      draw: () => {
        background.draw();
        globals.pipes.draw();
        globals.floor.draw();
        globals.flappyFish.draw(frames);
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
      },
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
