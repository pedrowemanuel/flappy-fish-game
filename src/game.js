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
    context.fillStyle = "#125c81";
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
      this.x + this.width,
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
    const floorMovement = 5;
    const repeatIn = this.width / 3;
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
  },
});

const createMessageGetReady = ({ canvas, context, sprites }) => ({
  spriteX: 134,
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
  gravity: 0.15,
  impulseSize: 3.6,
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

  const tap = () => {
    if (activeScreen.tap != undefined) {
      activeScreen.tap();
    }
  };

  const listenEvents = () => {
    window.addEventListener("click", tap);
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
        globals.floor.draw();
        globals.flappyFish.draw(frames);
      },
      tap: () => {
        globals.flappyFish.swimUp();
      },
      update: () => {
        if (collided(globals.flappyFish, globals.floor)) {
          settings.sounds.hit.play();
          changeScreen(screens.START);
          return;
        }
        globals.flappyFish.update();
        globals.floor.update();
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
