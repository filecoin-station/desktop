import { FC, ReactNode, useState } from 'react'

interface ISlider {
  children: Array<ReactNode>,
  onFinish: () => void
}

const Slider: FC<ISlider> = ({ children, onFinish }) => {
  const [page, setPage] = useState(0)

  const next = () => {
    setPage((page + 1) % (children.length))
  }

  const done = () => {
    setPage(0)
    onFinish()
  }

  return (
    <div className="w-[32rem] rounded-lg" data-testid="onboarding-element">
      {children[page]}
      <div className="flex justify-between rounded-b-lg bg-white px-16">
        <button
          className="inline-flex items-center mb-11 left-0 "
          onClick={(page !== children.length - 1 ? next : done)}>
          {/* <span className="text-xs" '{page !== children.length - 1 ? 'Prev' : 'Got It'}</span> */}
        </button>
        <div className="flex flex-row w-10 gap-1">
          {/* {children?.map((element: HTMLElement, index: number) =>
            <svg key={("svg-"+index)} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <circle fill={index === page ? '#262626' : '#A3A3A3'} cx="5" cy="5" r="5" />
            </svg>
          )} */}
        </div>
        <button
          className="inline-flex items-center mb-11 right-0 link-primary "
          onClick={(page !== children.length - 1 ? next : done)}>
          <span className="text-xs">{page !== children.length - 1 ? 'Next' : 'Got It'}</span>
        </button>
      </div>
    </div>
  )
}

interface IOnboarding {
  onFinish: () => void
}

const Onboarding: FC<IOnboarding> = ({ onFinish }) => {
  return (
    <Slider onFinish={onFinish}>
      <div className=''>
        <div className='h-1/2 bg-black rounded-t-lg'>
          <h1 className="p-3 title text-white font-bold px-14 py-14 ">Connect to Filecoin Station with your filecoin address.</h1>
        </div>
        <div className='bg-white h-auto'>
          <p className="text-body-l px-16 py-8 opacity-60">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis tristique maximus. Phasellus at rutrum magna. Vestibulum quis maximus urna, ac pellentesque libero.</p>
        </div>
      </div>

      <div className=''>
        <div className='h-1/2 bg-black rounded-t-lg'>
          <h1 className="p-3 title text-white font-bold px-14 py-14 ">Connect to Filecoin Station with your filecoin address.</h1>
        </div>
        <div className='bg-white h-auto'>
          <p className="text-body-l px-16 py-8 opacity-60">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer venenatis tristique maximus. Phasellus at rutrum magna. Vestibulum quis maximus urna, ac pellentesque libero.</p>
        </div>
      </div>

    </Slider>
  )
}

export default Onboarding
