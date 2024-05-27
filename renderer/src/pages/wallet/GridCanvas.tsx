import { useEffect, useRef } from 'react'
import { Grid } from 'src/lib/grid'

const GridCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()

  function handleResize () {
    if (gridCanvas.current && ref.current && ref.current.parentElement) {
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement,
        gridSize: 40
      })
    }
  }

  useEffect(() => {
    if (!gridCanvas.current && ref.current && ref.current.parentElement) {
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement,
        gridSize: 40
      })
    }

    // window.addEventListener('resize', handleResize)

    // return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas ref={ref} className='absolute'></canvas>
  )
}

export default GridCanvas
