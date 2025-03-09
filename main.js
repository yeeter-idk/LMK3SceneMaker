let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d", {willReadFrequently: true})

let alphaMap = new layer("alphaMap")
let alphaOutline = new layer("alphaOutline")
let colorMap = new layer("colorMap")
let lightMap = new layer("lightMap")

setCanvSize()

let canvasChanged = false
let curLayer = alphaMap

function updateCanvasImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height) 
  ctx.drawImage(curLayer.canvas, 0, 0)
  
  if(curLayer.id != alphaMap.id){
    ctx.globalCompositeOperation = "multiply"
    ctx.drawImage(alphaMap.canvas, 0, 0)
    ctx.globalCompositeOperation = "source-over"
    
    if(document.getElementById("showOutline").checked)
      ctx.drawImage(alphaOutline.canvas, 0, 0)
  }
  
  if(pen.drawType == "pixel"){
    let size = pen.radius * 2
    
    let width = canvas.width
    let height = canvas.height  
    
    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    
    function guideColor(value) {
      return (255-value) * 0.8 + value * 0.2
    }
    
    for(let x = 0; x<width; x += size){
      for(let y = 0; y<height; y += size){
        let index = x + y * width
        data[index*4] = guideColor(data[index*4])
        data[index*4+1] = guideColor(data[index*4+1])
        data[index*4+2] = guideColor(data[index*4+2])
        data[index*4+3] = 255       
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}

let frame = 0
loop()
function loop() {
  if(canvasChanged){
    updateCanvasImage()
    canvasChanged = false
  }
   
  frame++
  window.requestAnimationFrame(loop)
}

function fixAlpha() {
  let ctx = alphaMap.ctx;
  let imageData = ctx.getImageData(0, 0, alphaMap.canvas.width, alphaMap.canvas.height);
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let red = data[i];
    let bwValue = Math.round(red / 255) * 255;
    data[i] = data[i + 1] = data[i + 2] = bwValue;
  }

  ctx.putImageData(imageData, 0, 0);  
  createAlphaOutline()
  canvasChanged = true
}

function createAlphaOutline() {
  let ctx = alphaOutline.ctx;
  let width = alphaMap.canvas.width
  let height = alphaMap.canvas.height
  
  let imageData = ctx.createImageData(width, height);
  let data = imageData.data;
  
  let alphaData = alphaMap.ctx.getImageData(0, 0, width, height).data
  
  function getAlphaPixel(x, y) {
    return alphaData[(x+y*width)*4]
  }
  
  for (let i = 0; i < data.length; i += 4) {
    let index = i/4
    let x = index%width
    let y = Math.floor(index/width)
    
    if(alphaData[i] == 255) continue
    
    let edge = false
    if(getAlphaPixel(x, y-1) == 255){
      edge = true
    }else if(getAlphaPixel(x+1, y) == 255){
      edge = true
    }else if(getAlphaPixel(x, y+1) == 255){ 
      edge = true
    }else if(getAlphaPixel(x-1, y) == 255){
      edge = true
    }
    
    if(edge) data[i] = data[i + 1] = data[i + 2]  = data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0)
}

function transferLayerFocus(layerName) {
  const layers = {
    alpha: { map: alphaMap, btn: "btnAlpha" },
    color: { map: colorMap, btn: "btnColor" },
    light: { map: lightMap, btn: "btnLight" }
  };

  for(const key in layers){
    if(layers[key].map === curLayer){
      document.getElementById(layers[key].btn).classList.remove("layerSelected");
      break;
    }
  }

  // Update curLayer and apply the new selection
  if(layers[layerName]){
    curLayer = layers[layerName].map;
    document.getElementById(layers[layerName].btn).classList.add("layerSelected");
  }
  
  canvasChanged = true
}

function download() {
  return new Promise((resolve, reject) => {
    let mapWidth = canvas.width
    let mapHeight = canvas.height
    
    let c = document.createElement("canvas")
    c.width = mapWidth * 3
    c.height = mapHeight
    
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    // Draw maps side by side
    ctx.drawImage(alphaMap.canvas, 0, 0);
    ctx.drawImage(colorMap.canvas, mapWidth, 0);
    ctx.drawImage(lightMap.canvas, mapWidth * 2, 0);
    
    ctx.globalCompositeOperation = "multiply"
    ctx.drawImage(alphaMap.canvas, mapWidth, 0);
    ctx.drawImage(alphaMap.canvas, mapWidth * 2, 0);
    ctx.globalCompositeOperation = "source-over"
    
    // Convert to image and trigger download
    c.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Lighting_Scene_(${mapWidth}x${mapHeight})-${Math.floor(Math.random() * 1000)}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Delay revoking URL to prevent premature invalidation
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      resolve();
    }, "image/png");
  });
}