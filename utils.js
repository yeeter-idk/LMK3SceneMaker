class layer{
  constructor(id) {
    this.canvas = document.getElementById(id)
    this.ctx = this.canvas.getContext("2d", {willReadFrequently: true})
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

  [alphaMap, alphaOutline, colorMap, lightMap].forEach(resetCanvas);
}

document.getElementById("canvasWidth").addEventListener("change", setCanvSize)

document.getElementById("canvasHeight").addEventListener("change", setCanvSize)


canvas.addEventListener("touchstart", (e)=>{startDraw(e)})
canvas.addEventListener("touchmove", (e)=>{moveDraw(e)})
canvas.addEventListener("touchend", (e)=>{endDraw(e)})

canvas.addEventListener("mousedown", (e)=>{startDraw(e)})
canvas.addEventListener("mousemove", (e)=>{moveDraw(e)})
canvas.addEventListener("mouseup", (e)=>{endDraw(e)})
//canvas.addEventListener("mouseleave", (e)=>{endDraw(e)})

function startDraw(e) {
  e.preventDefault();

  if (e.type === 'mousedown' && e.button !== 0) return;

  pen.isDrawing = true;
  
  pen.pos = getCanvasRelativePosition(e);
  pen.startPos = getCanvasRelativePosition(e);
  pen.lastPos = getCanvasRelativePosition(e);

  pen.draw();
}

function moveDraw(e) {
  e.preventDefault();

  if(!pen.isDrawing) return;

  pen.lastPos.x = pen.pos.x;
  pen.lastPos.y = pen.pos.y;
  pen.pos = getCanvasRelativePosition(e);

  pen.draw();
}

function endDraw(e) {
  e.preventDefault();
  pen.isDrawing = false
  
  pen.endDraw()
  
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
document.getElementById("brushSize").addEventListener("input", () => {
  pen.radius = parseFloat(document.getElementById("brushSize").value);
  
  updateCanvasImage()
  
  ctx.globalCompositeOperation = "difference"
  ctx.strokeStyle = "white"
  ctx.lineWidth = 1
  
  ctx.beginPath() 
  ctx.arc(canvas.width/2, canvas.height/2, pen.radius, 0, Math.PI*2)
  ctx.stroke()
  ctx.globalCompositeOperation = "source-over"
});

document.getElementById("penType").addEventListener("change", () => {
  pen.drawType = document.getElementById("penType").value;
});

document.getElementById("showOutline").addEventListener("change", () => {
  canvasChanged = true
});
