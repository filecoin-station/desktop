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
    <div data-testid="consent-element" className='rounded-lg bg-white p-14'>
      <h1 className="font-bold title text-black ">
      Station asks for your consent to use your personal data to store and/or access information on a device.
      </h1>
      <div className='bg-white h-auto'>
          <p className="py-4 text-body-l opacity-60">Modules are independent services that can run on Station. The first module that Station will house is a Saturn node and the users will be able to earn FIL for contributing their resources and services to each module.</p>
        </div>
      
      <div className="flex gap-3 justify-end">
        <button className="link-primary no-underline"
          title="reject"
          onClick={reject} >Cancel
        </button>
        <button className="btn-primary"
          title="accept"
          onClick={accept}>Accept
        </button>
      </div>
    </div>
  )
}

export default Consent
