import { Position } from '@/types/position';

export const TILE_COUNT = 20;
const CANVAS_SIZE = 400;

export default class SnakeGameManager {
  #canvas: HTMLCanvasElement;
  #canvasContext: CanvasRenderingContext2D;
  #tileSize: number;

  #headPosition: Position;
  #applePosition: Position;

  #inputVelocity: Position;
  #velocity: Position;

  #score: number;
  #speed: number;

  #timeoutId: number | null;

  #snakeParts: Position[];
  #snakeTailLength: number;

  #isMoving: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    this.#canvasContext = this.#getCanvasContext(canvas);

    this.#canvas.width = CANVAS_SIZE;
    this.#canvas.height = CANVAS_SIZE;

    this.#tileSize = canvas.width / TILE_COUNT;

    this.#headPosition = this.#getRandomPosition();
    this.#applePosition = this.#getRandomPosition();

    this.#inputVelocity = { x: 0, y: 0 };
    this.#velocity = { x: 0, y: 0 };

    this.#score = 0;
    this.#speed = 10;

    this.#timeoutId = null;

    this.#snakeParts = [];
    this.#snakeTailLength = 2;

    this.#isMoving = false;

    this.#addEventHandler();
  }

  #getRandomPosition() {
    return { x: Math.floor(Math.random() * TILE_COUNT), y: Math.floor(Math.random() * TILE_COUNT) };
  }

  #getCanvasContext(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Not Found Canvas 2D Context');
    }

    return context;
  }

  #changeSnakePosition() {
    const headX = this.#headPosition.x + this.#velocity.x;
    const headY = this.#headPosition.y + this.#velocity.y;
    this.#headPosition = { x: headX, y: headY };
  }

  #isGameOver() {
    if (this.#velocity.x === 0 && this.#velocity.y === 0) {
      return false;
    }

    const { x: headX, y: headY } = { ...this.#headPosition };

    if (headX < 0 || headY < 0 || headX === TILE_COUNT || headY === TILE_COUNT) {
      return true;
    }

    for (const snakePart of this.#snakeParts) {
      if (snakePart.x === headX && snakePart.y === headY) {
        return true;
      }
    }

    return false;
  }

  #clearScreen() {
    this.#canvasContext.fillStyle = 'white';
    this.#canvasContext.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  #drawSnake() {
    const canvasContext = this.#canvasContext;
    const snakeParts = this.#snakeParts;
    const { x: headX, y: headY } = this.#headPosition;

    canvasContext.fillStyle = 'green';
    snakeParts.forEach((snakePart) => {
      canvasContext.fillRect(snakePart.x * TILE_COUNT, snakePart.y * TILE_COUNT, this.#tileSize, this.#tileSize);
    });

    snakeParts.push({ x: headX, y: headY });
    while (snakeParts.length > this.#snakeTailLength) {
      snakeParts.shift();
    }

    canvasContext.fillStyle = 'orange';
    canvasContext.fillRect(headX * TILE_COUNT, headY * TILE_COUNT, this.#tileSize, this.#tileSize);
  }

  #drawApple() {
    this.#canvasContext.fillStyle = 'red';
    this.#canvasContext.fillRect(
      this.#applePosition.x * TILE_COUNT,
      this.#applePosition.y * TILE_COUNT,
      this.#tileSize,
      this.#tileSize
    );
  }

  #checkAppleCollision() {
    if (this.#applePosition.x === this.#headPosition.x && this.#applePosition.y === this.#headPosition.y) {
      this.#applePosition = this.#getRandomPosition();
      this.#snakeTailLength += 1;
      this.#score += 1;
    }
  }

  #handleKeydown(event: KeyboardEvent) {
    if (this.#isMoving) {
      return;
    }

    const { x: inputXVelocity, y: inputYVelocity } = this.#inputVelocity;
    switch (event.key) {
      case 'ArrowUp':
        if (inputYVelocity === 1) break;
        this.#inputVelocity = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (inputYVelocity === -1) break;
        this.#inputVelocity = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (inputXVelocity === 1) break;
        this.#inputVelocity = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (inputXVelocity === -1) break;
        this.#inputVelocity = { x: 1, y: 0 };
        break;
      default:
        break;
    }

    this.#isMoving = true;
  }

  #addEventHandler() {
    document.addEventListener('keydown', this.#handleKeydown.bind(this));
  }

  #removeEventHandler() {
    document.removeEventListener('keydown', this.#handleKeydown.bind(this));
  }

  #reset() {
    this.#headPosition = this.#getRandomPosition();
    this.#applePosition = this.#getRandomPosition();

    this.#inputVelocity = { x: 0, y: 0 };
    this.#velocity = { x: 0, y: 0 };

    this.#score = 0;
    this.#speed = 10;

    this.#timeoutId = null;

    this.#snakeParts = [];
    this.#snakeTailLength = 2;

    this.drawEnd();
    this.drawGame();
  }

  drawGame() {
    this.#velocity = { ...this.#inputVelocity };

    this.#changeSnakePosition();

    if (this.#isGameOver()) {
      alert('GameOver!\nPress Enter key to restart your game.');
      return this.#reset();
    }

    this.#clearScreen();

    this.#checkAppleCollision();
    this.#drawApple();
    this.#drawSnake();

    if (this.#score > 5) {
      this.#speed = 12;
    }
    if (this.#score > 10) {
      this.#speed = 15;
    }
    this.#timeoutId = setTimeout(this.drawGame.bind(this), 1000 / this.#speed);
    this.#isMoving = false;
  }

  drawEnd() {
    if (this.#timeoutId) clearTimeout(this.#timeoutId);
    this.#removeEventHandler();
  }
}
