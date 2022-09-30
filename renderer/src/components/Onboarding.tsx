import { FC, useState } from 'react'
import { ReactComponent as Back } from './../assets/img/arrow-left.svg'
import { ReactComponent as Page } from './../assets/img/paginator-page.svg'
import { ReactComponent as CurrentPage } from './../assets/img/paginator-current.svg'

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
        className="btn-secondary-small flex items-center group back-button"
        disabled={page === 0}
        onClick={prev}
        type="button">
        <i><Back className="btn-icon-primary-small"/></i>
        <span>Back</span>
      </button>
      <div className='flex flex-row items-center space-between gap-3'>
        {[...Array(pages - 1).keys()].map((_, index) => {
          return index === page ? <CurrentPage key={index}/> : <Page key={index}/>
        })}
      </div>
      <button
        className="btn-secondary-small icon-primary"
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
        <div className={'w-[100%] max-w-[640px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page }>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px]'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m">Connect to Filecoin Station with your filecoin address.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-20 px-20 pt-16'>
              <p className="text-sm my-3">Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. In facilisis, lorem quis posuere porttitor, sem purus ultrices risus, vitae eleifend purus arcu a nibh. Quisque quis ultrices tellus.
                nec mollis arcu elit sit amet odio. </p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <Footer page={page} pages={pages} next={next} prev={prev} />
            </div>
          </div>
        </div>}

      {page === 1 &&
        <div className={'w-[100%] max-w-[640px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page }>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px]'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m">New modules are automatically installed in Station.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-20 px-20 pt-16'>
              <p className="text-sm my-3">Modules are independent services that can run on Station. The first module that Station will house is a Saturn node and the users will be able to earn FIL for contributing their resources and services to each module.</p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <Footer page={page} pages={pages} next={next} prev={prev} />
            </div>
          </div>
        </div>
      }

      {page === 2 &&
        <div className={'w-[100%] max-w-[940px] bg-white rounded-[10px] shadow-[0px_5px_25px_rgba(0,0,0,0.1)] onboarding-' + page }>
          <div className='bg-black px-20 py-16  rounded-t-[10px] min-h-[276px]'>
            <h1 className="font-title text-white leading-[3.25rem] text-header-m">Station asks for your consent to use your personal data to store and/or access information on a device.</h1>
          </div>
          <div className='min-h-[372px]'>
            <div className='pb-20 px-20 pt-16'>
              <p className="text-sm my-3">Your personal data will be processed and information from your device (cookies, unique identifiers, and other device data) may be stored by, accessed by and shared with third party vendors, or use specifically by this app.</p>
            </div>
            <div className='pb-20 bottom-0 px-20'>
              <div className="flex flex-row gap-3 justify-between">
                <button className="btn-secondary-small flex items-center group"
                  title="previous"
                  onClick={prev}>
                    <i><Back className="btn-icon-primary-small"/></i>
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
