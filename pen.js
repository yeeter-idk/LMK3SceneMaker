let pen = {
  isDrawing: false,
  color: "#ffffff",
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
      case "line":
        this.drawLine(true)
        break
      case "spray":
        this.drawSpray()
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
      case "line":
        this.drawLine(false)
        break
      case "spray":
        break
    }
    
    this.startPos = this.pos
    
    canvasChanged = true
  },
  drawSpray: function() {
    let ctx = curLayer.ctx      
    ctx.fillStyle = this.color
    for(let i = 0; i<50; i++){
      let angle = Math.random() * Math.PI * 2
    
      let dist = Math.random()*Math.random() * this.radius
    
      let x = Math.floor(this.pos.x + Math.sin(angle) * dist)
      let y = Math.floor(this.pos.y + Math.cos(angle) * dist)
    
      ctx.fillRect(x, y, 1, 1)
    }
  },
  drawBox: function(preview){
    let x = Math.floor(Math.min(this.startPos.x, this.pos.x))
    let y = Math.floor(Math.min(this.startPos.y, this.pos.y))
    let w = Math.ceil(Math.abs(this.startPos.x - this.pos.x))
    let h = Math.ceil(Math.abs(this.startPos.y - this.pos.y))
    
    if(preview){
      ctx.globalCompositeOperation = "difference"
      ctx.strokeStyle = "white"
  
      ctx.strokeRect(x+0.5, y+0.5, w, h)      
      ctx.globalCompositeOperation = "source-over"
    }else{
      let ctx = curLayer.ctx
           
      ctx.fillStyle = this.color
      ctx.fillRect(x, y, w, h)  
    }
  },
  drawLine: function(preview){
    if(preview){
      ctx.globalCompositeOperation = "difference"
      ctx.strokeStyle = "white"
  
      ctx.lineWidth = this.radius*2
  
      ctx.beginPath()
      ctx.moveTo(this.startPos.x, this.startPos.y)
      ctx.lineTo(this.pos.x, this.pos.y)
      ctx.stroke()
      
      ctx.lineWidth = 1
      ctx.globalCompositeOperation = "source-over"
    }else{
      let ctx = curLayer.ctx
           
      ctx.strokeStyle = this.color
      ctx.lineWidth = this.radius*2
  
      ctx.beginPath()
      ctx.moveTo(this.startPos.x, this.startPos.y)
      ctx.lineTo(this.pos.x, this.pos.y)
      ctx.stroke()      
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

