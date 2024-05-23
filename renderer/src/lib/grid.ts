type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class Grid {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  gridSize: number
  dashSize: number
  rows: Line[] = []
  cols : Line[] = []
  height: number
  width: number
  target = { x: 0, y: 0 }

  constructor ({
    canvas,
    container,
    gridSize
  }: {
    canvas: HTMLCanvasElement;
    container: HTMLDivElement;
    gridSize: number;
 }) {
    const dPr = window.devicePixelRatio
    this.gridSize = gridSize
    this.canvas = canvas
    this.width = container.clientWidth
    this.height = container.clientHeight

    this.canvas.width = this.width * dPr
    this.canvas.height = this.height * dPr
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx = canvas.getContext('2d')!
    this.ctx.scale(dPr, dPr)

    this.dashSize = Math.round(this.gridSize / 8)
    this.target = { x: this.width / 2, y: 90 }

    this.setupCanvasStyles(container)
    this.calcGridLines()
    this.render()
    this.renderMidLine()
    this.renderTargetCircles()
  }

  setupCanvasStyles (container: HTMLDivElement) {
    this.ctx.imageSmoothingQuality = 'high'
    this.ctx.imageSmoothingEnabled = true
    this.ctx.strokeStyle = '#FFFFFF66'
    this.ctx.fillStyle = '#F1F1F5'
    this.ctx.lineWidth = 0.5
    this.ctx.setLineDash([this.dashSize])
    // Translate the canvas so we can work with whole pixel values and still get crisp lines
    this.ctx.translate(0.5, 0.5)
  }

  getAdjustedGridSize () {
    const rowCount = Math.floor(this.height / this.gridSize)
    let colCount = Math.floor(this.width / this.gridSize)

    // Ensure the number of columns is odd, so we can have 1 central line
    if (colCount % 2 === 0) {
      colCount++
    }

    // Calculate offset to ensure a symetric grid
    const colOffsetX = (this.width - (colCount - 1) * this.gridSize) / 2
    const rowOffsetY = (this.height - (rowCount - 1) * this.gridSize) / 2 - this.dashSize / 2

    return {
      colCount,
      rowCount,
      colOffsetX,
      rowOffsetY,
      rowOffsetX: -this.dashSize / 2
    }
  }

  calcGridLines () {
    const size = this.getAdjustedGridSize()
    this.cols = new Array(size.colCount).fill(null).map((_, ind) => {
      const xPoint = ind * this.gridSize + size.colOffsetX

      return {
        x1: xPoint,
        y1: 0,
        x2: xPoint,
        y2: this.canvas.height
      }
    })
    this.rows = new Array(size.rowCount).fill(null).map((_, ind) => {
      const yPoint = ind * this.gridSize + size.rowOffsetY

      return {
        x1: size.rowOffsetX,
        y1: yPoint,
        x2: this.canvas.width,
        y2: yPoint
      }
    })
  }

  renderMidLine () {
    const midX = Math.round(this.width / 2)
    this.ctx.lineWidth = 0.8
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.beginPath()
    this.ctx.moveTo(midX, this.target.y + 20)
    this.ctx.lineTo(midX, 500)
    this.ctx.stroke()
    this.ctx.stroke()
  }

  circle (x: number, y: number, size: number) {
    this.ctx.ellipse(
      x,
      y,
      size,
      size,
      Math.PI / 4,
      0,
      2 * Math.PI)
  }

  renderTargetCircles () {
    this.ctx.setLineDash([4])
    this.ctx.beginPath()
    this.circle(this.target.x, this.target.y, 4)
    this.ctx.fill()
    this.ctx.beginPath()
    this.circle(this.target.x, this.target.y, 8)
    this.ctx.stroke()
    this.ctx.beginPath()
    this.circle(this.target.x, this.target.y, 20)
    this.ctx.stroke()
  }

  render () {
    this.cols.forEach((col) => {
      this.ctx.beginPath()
      this.ctx.moveTo(col.x1, col.y1)
      this.ctx.lineTo(col.x2, col.y2)
      this.ctx.stroke()
    })
    this.rows.forEach((col) => {
      this.ctx.beginPath()
      this.ctx.moveTo(col.x1, col.y1)
      this.ctx.lineTo(col.x2, col.y2)
      this.ctx.stroke()
    })

    this.ctx.translate(-0.5, -0.5)
  }
}
