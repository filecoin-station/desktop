import { useEffect, useRef } from 'react'
import { Grid } from 'src/lib/grid'

const GridCanvas = ({
  container
}: {
    container: React.RefObject<HTMLDivElement>;
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()

  useEffect(() => {
    if (!gridCanvas.current && ref.current && container.current) {
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: container.current,
        gridSize: 40
      })
    }
  }, [])

  return (
    <canvas ref={ref} className='absolute'></canvas>
  )
}

export default GridCanvas
