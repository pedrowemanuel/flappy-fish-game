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
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  speed: 0,
  gravity: 0.2,
  impulseSize: 3.6,
  update() {
    this.speed += this.gravity;
    this.y += this.speed;
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
  },
  swimUp() {
    this.speed = -this.impulseSize;
  },
});

const game = (settings) => {
  const globals = {};

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
  const floor = createFloor(settings);
  const messageGetReady = createMessageGetReady(settings);

  const screens = {
    START: {
      initialize: () => {
        globals.flappyFish = createFlappyFish(settings, floor);
      },
      draw: () => {
        background.draw();
        floor.draw();
        globals.flappyFish.draw();
        messageGetReady.draw();
      },
      tap: () => {
        changeScreen(screens.GAME);
      },
      update: () => {},
    },
    GAME: {
      draw: () => {
        background.draw();
        floor.draw();
        globals.flappyFish.draw();
      },
      tap: () => {
        globals.flappyFish.swimUp();
      },
      update: () => {
        if (collided(globals.flappyFish, floor)) {
          settings.sounds.hit.play();
          changeScreen(screens.START);
          return;
        }
        globals.flappyFish.update();
      },
    },
  };

  function loop() {
    activeScreen.update();
    activeScreen.draw();
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
