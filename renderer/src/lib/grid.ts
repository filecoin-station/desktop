type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    deform: boolean;
    ease: number;
    nthFromCenter: number;
}

function easeInOutCubic (x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export class Grid {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  height: number
  width: number
  gridSize: number
  dashSize: number
  rows: Line[] = []
  cols : Line[] = []
  target = { x: 0, y: 0 }
  warp = { x: 0, y: 550, radius: 80, linesAffected: 8 }
  force = 200

  constructor ({
    canvas,
    container,
    gridSize
  }: {
      canvas: HTMLCanvasElement;
      container: HTMLElement;
      gridSize: number;
   }) {
    const dPr = window.devicePixelRatio
    this.gridSize = gridSize
    this.canvas = canvas
    this.width = container.clientWidth
    this.height = container.clientHeight

    // Ensure the canvas is crisp
    this.canvas.width = this.width * dPr
    this.canvas.height = this.height * dPr
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx = canvas.getContext('2d')!
    this.ctx.scale(dPr, dPr)

    this.dashSize = Math.round(this.gridSize / 8)
    this.target = { x: this.width / 2, y: 90 }
    this.warp.x = this.width / 2
    this.warp.y = 70 * this.height / 100

    this.setupCanvasStyles()
    this.calcGridLines()
    this.renderGrid()
    this.renderMidLine()
    this.renderTargetCircles()
  }

  setupCanvasStyles () {
    this.ctx.imageSmoothingQuality = 'high'
    this.ctx.imageSmoothingEnabled = true
    this.ctx.strokeStyle = '#FFFFFF66'
    this.ctx.fillStyle = '#F1F1F5'
    this.ctx.lineWidth = 0.5
    this.ctx.setLineDash([this.dashSize])
    this.ctx.translate(0.5, 0.5)
  }

  getAdjustedGridSize () {
    const rowCount = Math.floor(this.height / this.gridSize)
    let colCount = Math.floor(this.width / this.gridSize)

    // Ensure the number of columns is odd, so we can have 1 central line
    if (colCount % 2 === 0) {
      colCount++
    }

    // Calculate offset to ensure a symmetric grid
    const colOffsetX = (this.width - (colCount - 1) * this.gridSize) / 2
    const rowOffsetY = (this.height - (rowCount - 1) * this.gridSize) / 2 - this.dashSize / 2

    return {
      colCount,
      warpCenterColIdx: this.lineCount(this.warp.x),
      warpCenterRowIdx: this.lineCount(this.warp.y),
      rowCount,
      colOffsetX,
      rowOffsetY,
      rowOffsetX: -this.dashSize / 2
    }
  }

  lineCount (val: number) {
    return Math.floor(val / this.gridSize)
  }

  calcGridLines () {
    const size = this.getAdjustedGridSize()

    let acc = 0

    this.cols = new Array(size.colCount).fill(null).map((_, index) => {
      const xPoint = index * this.gridSize + size.colOffsetX
      const nthFromCenter = this.lineCount(Math.abs(this.warp.x - xPoint))

      const isPastHalfway = index > size.warpCenterColIdx
      const deform = Math.abs(nthFromCenter) < this.warp.linesAffected
      let ease = 0

      const progress = isPastHalfway
        ? (this.warp.linesAffected - nthFromCenter - 1) / this.warp.linesAffected
        : (this.warp.linesAffected - nthFromCenter) / this.warp.linesAffected

      const accEase = easeInOutCubic(progress)
      ease = accEase - acc
      acc = accEase

      return {
        x1: xPoint,
        y1: 0,
        x2: xPoint,
        y2: this.height,
        cp1x: xPoint,
        cp1y: this.warp.y,
        cp2x: xPoint,
        cp2y: this.warp.y,
        deform,
        ease,
        nthFromCenter
      }
    })

    this.rows = new Array(size.rowCount).fill(null).map((_, index) => {
      const yPoint = index * this.gridSize + size.rowOffsetY
      const nthFromCenter = this.lineCount(Math.abs(this.warp.y - yPoint))

      const isPastHalfway = index > size.warpCenterRowIdx
      const deform = Math.abs(nthFromCenter) < this.warp.linesAffected
      let ease = 0

      const progress = isPastHalfway
        ? (this.warp.linesAffected - nthFromCenter - 1) / this.warp.linesAffected
        : (this.warp.linesAffected - nthFromCenter) / this.warp.linesAffected

      const accEase = easeInOutCubic(progress)
      ease = accEase - acc
      acc = accEase

      return {
        x1: size.rowOffsetX,
        y1: yPoint,
        x2: this.canvas.width,
        y2: yPoint,
        cp1x: this.warp.x,
        cp1y: yPoint,
        cp2x: this.warp.x,
        cp2y: yPoint,
        deform,
        ease,
        nthFromCenter
      }
    })
  }

  renderMidLine () {
    const midX = this.width / 2
    this.ctx.lineWidth = 0.8
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.beginPath()
    this.ctx.moveTo(midX, this.target.y + 20)
    this.ctx.lineTo(midX, 500)
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

  getCurveConfig (axis: 'x' | 'y', line: Line) {
    const bendOffset = this.warp.radius * 2.5
    const bendInStart = this.warp[axis] - bendOffset
    const bendOutEnd = this.warp[axis] + bendOffset
    const bendFollow = (this.force / 20) * line.ease

    const apply = line.ease * this.force
    const bendSize = 100 * Math.abs(line.ease)

    return {
      bendInStart,
      bendInEnd: bendInStart + bendSize,
      bendInCp: bendInStart + bendSize / 2,
      bendFollow,
      bendOutStart: bendOutEnd - bendSize,
      bendOutCp: bendOutEnd - bendSize / 2,
      bendOutEnd,
      apply
    }
  }

  renderGrid () {
    this.cols.forEach((col) => {
      this.ctx.beginPath()
      this.ctx.moveTo(col.x1, col.y1)

      if (col.deform) {
        const config = this.getCurveConfig('y', col)
        // line
        // this.ctx.lineTo(col.x1, config.bendInStart)
        // this.ctx.strokeStyle = 'lightblue'
        this.ctx.stroke()

        // curve in
        // this.ctx.beginPath()
        // this.ctx.moveTo(col.x1, config.bendInStart)
        // this.ctx.strokeStyle = 'yellow'
        this.ctx.quadraticCurveTo(
          col.x1,
          config.bendInCp,
          col.x1 + config.bendFollow,
          config.bendInEnd
        )
        // this.ctx.stroke()

        // deform
        // this.ctx.beginPath()
        // this.ctx.moveTo(col.x1 + config.bendFollow,
        //   config.bendInEnd)
        // this.ctx.strokeStyle = 'hotpink'
        this.ctx.bezierCurveTo(
          col.cp1x + config.apply,
          col.cp1y,
          col.cp1x + config.apply,
          col.cp2y,
          col.x2 + config.bendFollow,
          config.bendOutStart
        )
        // this.ctx.stroke()

        // curve out
        // this.ctx.strokeStyle = 'yellow'
        // this.ctx.beginPath()
        // this.ctx.moveTo(col.x2 + config.bendFollow,
        //   config.bendOutStart)
        this.ctx.quadraticCurveTo(
          col.x2,
          config.bendOutCp,
          col.x2,
          config.bendOutEnd
        )
        // this.ctx.stroke()
        // line
        // this.ctx.beginPath()
        // this.ctx.moveTo(col.x2,
        //   config.bendOutEnd)
        // this.ctx.strokeStyle = 'red'
        this.ctx.lineTo(col.x2, col.y2)
      } else {
        this.ctx.lineTo(col.x2, col.y2)
      }

      this.ctx.stroke()
    })
    this.rows.forEach((row) => {
      this.ctx.beginPath()
      this.ctx.moveTo(row.x1, row.y1)

      if (row.deform) {
        const config = this.getCurveConfig('x', row)

        // line
        this.ctx.lineTo(config.bendInStart, row.y1)

        // curve in
        this.ctx.quadraticCurveTo(
          config.bendInCp,
          row.y1,
          config.bendInEnd,
          row.y1 + config.bendFollow
        )
        // deform
        this.ctx.bezierCurveTo(
          row.cp1x,
          row.cp1y + config.apply,
          row.cp2x,
          row.cp2y + config.apply,
          config.bendOutStart,
          row.y2 + config.bendFollow
        )
        // curve out
        this.ctx.quadraticCurveTo(
          config.bendOutCp,
          row.y2,
          config.bendOutEnd,
          row.y2
        )
        // line
        this.ctx.lineTo(row.x2, row.y2)
      } else {
        this.ctx.lineTo(row.x2, row.y2)
      }

      this.ctx.stroke()
    })

    this.ctx.translate(-0.5, -0.5)
  }
}
