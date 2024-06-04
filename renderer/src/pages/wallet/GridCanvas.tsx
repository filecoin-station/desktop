import { useEffect, useRef, useState } from 'react'
import { Wallet } from 'src/hooks/StationWallet'
import { Grid } from 'src/lib/grid'

const minWarp = 0
const maxWarp = 300

function getForceFromBalance (balance: number) {
  console.log(balance * 300 / 0.8)
  return balance * 260 / 0.8
}

const GridCanvas = ({
  walletBalance,
  destinationFilAddress
}: {
  walletBalance: Wallet['walletBalance'];
  destinationFilAddress: Wallet['destinationFilAddress'];
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()
  const balance = Number(walletBalance)

  function handleResize () {
    gridCanvas.current?.setup(ref.current?.parentElement || undefined)
  }

  useEffect(() => {
    if (!gridCanvas.current && ref.current && ref.current.parentElement) {
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement,
        gridSize: 40,
        force: 0
      })
      gridCanvas.current.renderGrid()
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (destinationFilAddress && gridCanvas.current) {
      gridCanvas.current.tweenRender({
        duration: 100,
        targetForce: getForceFromBalance(Number(walletBalance)),
        delay: 500
      })
    }
  }, [destinationFilAddress, walletBalance])

  return (
    <canvas ref={ref} className='absolute opacity-0 animate-fadeIn'></canvas>
  )
}

export default GridCanvas
