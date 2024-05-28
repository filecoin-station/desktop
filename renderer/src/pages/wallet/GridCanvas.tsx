import { useEffect, useRef, useState } from 'react'
import { Grid } from 'src/lib/grid'

const GridCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()

  const [force] = useState(0)

  function handleResize () {
    gridCanvas.current?.setup(ref.current?.parentElement || undefined)
  }

  useEffect(() => {
    if (!gridCanvas.current && ref.current && ref.current.parentElement) {
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement,
        gridSize: 40,
        force
      })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas ref={ref} className='absolute'></canvas>
  )
}

export default GridCanvas
