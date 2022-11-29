import { FC, useState } from 'react'
import { ReactComponent as Back } from './../assets/img/icons/arrow-left.svg'
import { ReactComponent as Page } from './../assets/img/icons/paginator-page.svg'
import { ReactComponent as CurrentPage } from './../assets/img/icons/paginator-current.svg'

interface FooterProps {
  page: number,
  pages: number,
  next: () => void,
  prev: () => void
}

const Footer: FC<FooterProps> = ({ page, pages, next, prev }) => {
  return (
    <div className="flex justify-between">
      <button
        className="btn-secondary-small flex items-center group back-button border-none"
        disabled={page === 0}
        onClick={prev}
        type="button">
        <i><Back className="btn-icon-primary-small" fill={page === 0 ? '#b3b3b3' : '#2a1cf7'} /></i>
        <span>Back</span>
      </button>
      <div className='flex flex-row items-center space-between gap-3'>
        {[...Array(pages - 1).keys()].map((_, index) => {
          return index === page ? <CurrentPage key={index} /> : <Page key={index} />
        })}
      </div>
      <button
        className="btn-secondary-small border-none"
        onClick={next}>
        <span className="">Continue</span>
      </button>
    </div>
  )
}

interface OnboardingProps {
  onFinish: () => void
}

const Onboarding: FC<OnboardingProps> = ({ onFinish }) => {
  const [page, setPage] = useState(0)
  const pages = 3
  const next = () => setPage(page + 1)
  const prev = () => setPage(page - 1)

  return (
    <div className="onboarding">
      {page === 0 &&
        <div className={'w-[100%] max-w-[640px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page}>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px] flex'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m my-auto">Join the Filecoin Economy.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-20 px-20 pt-16 min-h-[250px]'>
              <p className="text-body-s my-3">
                Station securely connects your computer to Filecoin's global peer-to-peer network, which rewards you for your participation. Once you've connected, you will begin completing network jobs.
              </p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <Footer page={page} pages={pages} next={next} prev={prev} />
            </div>
          </div>
        </div>
      }

      {page === 1 &&
        <div className={'w-[100%] max-w-[640px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page}>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px] flex'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m my-auto"> Set up your rewards.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-20 px-20 pt-16 min-h-[250px]'>
              <p className="text-body-s my-3">
                Before you start, you will need to link a FIL address to Station.
              </p>
              <p className="text-body-s my-3">
                Filecoin will be transferred to your wallet periodically according to your participation.
              </p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <Footer page={page} pages={pages} next={next} prev={prev} />
            </div>
          </div>
        </div>
      }

      {page === 2 &&
        <div className={'w-[100%] max-w-[940px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page}>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px] flex'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m my-auto">Before we launch.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-8 px-20 pt-8 min-h-[250px]'>
              <p className="text-body-s my-3">
                Station asks for your consent to use your personal data to store and/or access information on a device.
                Your personal data will be processed and information from your device (cookies, unique identifiers, and other device data) may be stored by, accessed by and shared with third party vendors, or used specifically by this app.
              </p>
              <p className="text-body-s my-3">
                By clicking on the “Accept” button or otherwise continuing to use this service, you agree, you have read, understand and accept Station's Terms & Conditions.
              </p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <div className="flex flex-row gap-3 justify-between">
                <button className="btn-secondary-small flex items-center group border-none underline underline-offset-4"
                  title="previous"
                  onClick={prev}>
                  <i><Back className="btn-icon-primary-small" fill='#2a1cf7' /></i>
                  <span>Back</span>
                </button>
                <button className="btn-primary-small"
                  title="accept"
                  onClick={() => { onFinish() }}>Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Onboarding
