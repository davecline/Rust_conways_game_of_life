// Import all the parts from the WASM library
import * as wasm from "wasm-game-of-life";

// Import the WebAssembly memory at the top of the file.
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 2; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#000000";
const ALIVE_COLOR = "#00ff00";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Construct the universe, and get its width and height.
const universe = wasm.Universe.new(100);
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;
const ctx = canvas.getContext('2d');

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var stop = false;
var frameCount = 0;
//var $results = document.getElementById("game-of-life-canvas"); //$("#results");
var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function animate() {

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        
        // const title = document.getElementById("title");
        // const titleCtx = title.getContext('2d');
        // titleCtx.fillStyle = "#fff000";
        // titleCtx.fillRect(100,100,10,10);

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        let boost = new Date().getMilliseconds();
        universe.tick(0);//boost % 11111 === 0 ? 1 : 0);
            
       // drawGrid();
        drawCells();

    }

    // request another frame
    requestAnimationFrame(animate);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx.stroke();
  };


const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === wasm.Cell.Dead
        ? DEAD_COLOR
        : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  //ctx.stroke();
};

startAnimating(10);
