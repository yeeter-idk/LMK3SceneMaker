let pen = {
  isDrawing: false,
  color: "#000000",
  pos: {x: 0, y: 0},
  startPos: {x: 0, y: 0},
  lastPos: {x: 0, y: 0},
  radius: 10,
  drawType: "pen",
  draw: function() {  
    updateCanvasImage()
    
    switch(this.drawType){
      case "pen":
        this.drawPen()
        break
      case "box":
        this.drawBox(true)
        break
    }
    
    //canvasChanged = true
  },
  endDraw: function() {
    switch(this.drawType){
      case "pen":
        break
      case "box":
        this.drawBox(false)
        break
    }

    this.startPos = this.pos
    
    canvasChanged = true
  },
  drawBox: function(preview){
    let x = Math.floor(Math.min(this.startPos.x, this.pos.x))
    let y = Math.floor(Math.min(this.startPos.y, this.pos.y))
    let w = Math.ceil(Math.abs(this.startPos.x - this.pos.x))
    let h = Math.ceil(Math.abs(this.startPos.y - this.pos.y))
    
    if(preview){
      ctx.globalCompositeOperation = "difference"
      ctx.strokeStyle = "white"
  
      ctx.strokeRect(x, y, w, h)      
      ctx.globalCompositeOperation = "source-over"
    }else{
      let ctx = curLayer.ctx
           
      ctx.fillStyle = this.color
      ctx.fillRect(x, y, w, h)  
    }
  },
  drawPen: function() {
    let ctx = curLayer.ctx
    
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.radius*2
    
    ctx.beginPath()
    ctx.moveTo(this.lastPos.x, this.lastPos.y)
    ctx.lineTo(this.pos.x, this.pos.y)
    ctx.stroke()  
    
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
    ctx.fill() 
  }
}

