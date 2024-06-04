import { useEffect, useRef, useState } from 'react'
import { Wallet } from 'src/hooks/StationWallet'
import { Grid } from 'src/lib/grid'

const GridCanvas = ({
  walletBalance
}: {
  walletBalance: Wallet['walletBalance'];
}) => {
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
      gridCanvas.current.renderGrid()
      gridCanvas.current.tweenRender({ duration: 100, targetForce: 200, delay: 500 })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas ref={ref} className='absolute opacity-0 animate-fadeIn'></canvas>
  )
}

export default GridCanvas
