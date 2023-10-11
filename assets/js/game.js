const sprites = new Image();
sprites.src = "/assets/images/sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = "#2FE6FF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x + background.width,
      background.y,
      background.width,
      background.height
    );
  },
};

const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw() {
    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.x,
      floor.y,
      floor.width,
      floor.height
    );

    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.x + floor.width,
      floor.y,
      floor.width,
      floor.height
    );
  },
};

const flappyFish = {
  spriteX: 0,
  spriteY: 0,
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      flappyFish.spriteX,
      flappyFish.spriteY, // Sprite X, Sprite Y
      flappyFish.width,
      flappyFish.height, // Tamanho do recorte na sprite
      flappyFish.x,
      flappyFish.y,
      flappyFish.width,
      flappyFish.height
    );
  },
};

function loop() {
  background.draw();
  floor.draw();
  flappyFish.draw();

  flappyFish.y = flappyFish.y + 1;

  requestAnimationFrame(loop);
}

loop();
