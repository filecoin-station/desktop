import React, { FC } from 'react'

interface IConsent {
  onAccept: () => void,
  onReject: () => void
}

const Consent: FC<IConsent> = ({ onAccept, onReject }) => {
  const reject = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onReject()
  }

  const accept = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onAccept()
  }

  return (
    <div data-testid="consent-element">
      <img src='' className="w-full h-auto my-3" alt="Onboarding slide 1" />
      <h1 className="font-bold text-xl my-3">Station asks for your consent to use your personal data to store and/or access information on a device.</h1>
      <p className="text-sm my-3">Your personal data will be processed and information from your device (cookies, unique identifiers, and other device data) may be stored by, accessed by and shared with third party vendors, or use specifically by this app.
      </p>
      <div className="flex gap-3 justify-end">
        <button className="bg-transparent hover:bg-gray-100 text-neutral-500 py-2 px-4 inline-flex items-center"
          title="reject"
          onClick={reject} >Reject
        </button>
        <button className="bg-gray-700 hover:bg-gray-900 text-neutral-50 py-2 px-4 inline-flex items-center"
          title="accept"
          onClick={accept}>Accept
        </button>
      </div>
    </div>
  )
}

export default Consent
