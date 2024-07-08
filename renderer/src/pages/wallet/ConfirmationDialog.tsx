import { useDialog } from 'src/components/DialogProvider'
import { formatFilValue, truncateString } from 'src/lib/utils'

const ConfirmationDialog = ({
  amount,
  destination,
  onProceed
}: {
  amount: string;
  destination: string;
  onProceed: () => void;
}) => {
  const { closeDialog } = useDialog()

  function handleProceed () {
    onProceed()
    closeDialog()
  }

  return (
    <div>
      <p>Confirm</p>
      <p>Send {formatFilValue(amount)} FIL to {truncateString(destination)}</p>
      <div className='my-2 flex gap-4'>
        <button type='button'onClick={closeDialog}>Cancel</button>
        <button type='button'onClick={handleProceed}>Transfer</button>

      </div>
    </div>
  )
}

export default ConfirmationDialog
