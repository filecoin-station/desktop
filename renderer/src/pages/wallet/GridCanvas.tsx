import { useEffect, useRef } from 'react'
import { Wallet } from 'src/hooks/StationWallet'
import { Grid } from 'src/lib/grid'
import { FILTransactionProcessing } from '../../../../shared/typings'
import { getGridConfigForBalance } from 'src/lib/grid-utils'

const GridCanvas = ({
  walletBalance,
  destinationFilAddress,
  processingTransaction
}: {
  walletBalance: Wallet['walletBalance'];
  destinationFilAddress: Wallet['destinationFilAddress'];
  processingTransaction?: FILTransactionProcessing;
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const grid = useRef<Grid>()

  // On resize, run setup again to correct positioning
  function handleResize () {
    grid.current?.setup(ref.current?.parentElement || undefined)
    grid.current?.renderGrid()
  }

  useEffect(() => {
    // Initial canvas setup, should only run once
    if (!grid.current && ref.current?.parentElement) {
      grid.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement
      })
      grid.current.updateWarp(getGridConfigForBalance(Number(walletBalance)))
      grid.current.renderGrid()
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Adjust warping to balance
    if (destinationFilAddress && !processingTransaction) {
      const config = getGridConfigForBalance(Number(walletBalance))

      grid.current?.updateWarp(config)
      grid.current?.tweenRender({
        duration: 100,
        targetForce: config.force,
        delay: 500
      })
    }
  }, [destinationFilAddress, walletBalance, processingTransaction])

  return (
    <>
      <canvas ref={ref} className='absolute opacity-0 animate-fadeIn'></canvas>
      {processingTransaction?.status === 'processing' && (
        <div className={`absolute w-[70px] aspect-square animate-moveGridBlur 
        top-[50%] right-0 left-0 m-auto rounded-full
        bg-white mix-blend-overlay blur`}
        ></div>
      )}
    </>
  )
}

export default GridCanvas
