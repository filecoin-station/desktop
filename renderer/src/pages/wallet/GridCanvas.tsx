import { useEffect, useRef } from 'react'
import { Grid } from 'src/lib/grid'

const GridCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()

  useEffect(() => {
    if (!gridCanvas.current && ref.current && ref.current.parentElement) {
      console.log()
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement,
        gridSize: 40
      })
    }
  }, [])

  return (
    <canvas ref={ref} className='absolute'></canvas>
  )
}

export default GridCanvas
