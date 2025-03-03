class layer{
  constructor(id) {
    this.canvas = document.getElementById(id)
    this.ctx = this.canvas.getContext("2d")
    this.id = id
  }
}

function setCanvSize() {
  let width = document.getElementById("canvasWidth").value;
  let height = document.getElementById("canvasHeight").value;

  function resetCanvas(map) {
    map.canvas.width = width;
    map.canvas.height = height;
    map.ctx.fillStyle = "black";
    map.ctx.fillRect(0, 0, width, height);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  [alphaMap, colorMap, lightMap].forEach(resetCanvas);
}

document.getElementById("canvasWidth").addEventListener("change", setCanvSize)

document.getElementById("canvasHeight").addEventListener("change", setCanvSize)


let isDrawing = false;  // Track whether the mouse is currently pressed (drawing)

canvas.addEventListener("touchstart", (e) => { startDraw(e); });
canvas.addEventListener("touchmove", (e) => { moveDraw(e); });
canvas.addEventListener("touchend", (e) => { if (curLayer.id === "alphaMap") fixAlpha(); });

canvas.addEventListener("mousedown", (e) => { startDraw(e); });
canvas.addEventListener("mousemove", (e) => { moveDraw(e); });
canvas.addEventListener("mouseup", (e) => { endDraw(e); });  // Corrected this to use `endDraw`

canvas.addEventListener("mouseleave", (e) => { endDraw(e); });  // Stop drawing if mouse leaves the canvas

function startDraw(e) {
  e.preventDefault();

  // Only start drawing if the left mouse button is pressed (or on touchstart)
  if (e.type === 'mousedown' && e.button !== 0) return;

  isDrawing = true;  // Set drawing state to true
  
  pen.pos = getCanvasRelativePosition(e);
  pen.lastPos = getCanvasRelativePosition(e);

  pen.draw();
}

function moveDraw(e) {
  e.preventDefault();

  // Only continue drawing if the mouse is pressed (left button) or on touchmove
  if (!isDrawing) return;

  pen.lastPos.x = pen.pos.x;
  pen.lastPos.y = pen.pos.y;
  pen.pos = getCanvasRelativePosition(e);

  pen.draw();
}

function endDraw(e) {
  e.preventDefault();
  isDrawing = false;  // Stop drawing when the mouse button is released
  
  // Optionally call fixAlpha() if the active layer is alphaMap
  if (curLayer.id === "alphaMap") fixAlpha();
}

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let clientX, clientY;

  if (event.touches) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// Color picker change event
document.getElementById("colorPicker").addEventListener("change", () => {
  pen.color = document.getElementById("colorPicker").value;
});

// Brush size change event
document.getElementById("brushSize").addEventListener("change", () => {
  pen.radius = parseInt(document.getElementById("brushSize").value);
});
