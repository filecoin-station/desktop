import { useEffect, useRef } from 'react'
import { Wallet } from 'src/hooks/StationWallet'
import { Grid } from 'src/lib/grid'
import { FILTransactionProcessing } from '../../../../shared/typings'

function getForceFromBalance (balance: number) {
  console.log(balance * 260 / 5)
  return balance * 260 / 1.3
}

const GridCanvas = ({
  walletBalance,
  destinationFilAddress,
  transaction
}: {
  walletBalance: Wallet['walletBalance'];
  destinationFilAddress: Wallet['destinationFilAddress'];
  transaction?: FILTransactionProcessing;
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const gridCanvas = useRef<Grid>()

  // On resize, run setup again to correct positioning
  function handleResize () {
    gridCanvas.current?.setup(ref.current?.parentElement || undefined)
    gridCanvas.current?.renderGrid()
  }

  useEffect(() => {
    if (!gridCanvas.current && ref.current?.parentElement) {
      // Initial canvas setup
      gridCanvas.current = new Grid({
        canvas: ref.current,
        container: ref.current.parentElement
      })

      gridCanvas.current.renderGrid()
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Adjust warping to balance
  useEffect(() => {
    if (destinationFilAddress) {
      gridCanvas.current?.tweenRender({
        duration: 100,
        targetForce: getForceFromBalance(Number(walletBalance)),
        delay: 500
      })
    }
  }, [destinationFilAddress, walletBalance])

  return (
    <>
      <canvas ref={ref} className='absolute opacity-0 animate-fadeIn'></canvas>
      {transaction?.status === 'processing' && (
        <div className={`absolute w-[70px] aspect-square animate-moveGridBlur 
        top-[50%] right-0 left-0 m-auto rounded-full
        bg-white mix-blend-overlay blur`}
        ></div>
      )}
    </>
  )
}

export default GridCanvas
