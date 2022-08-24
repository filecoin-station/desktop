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
    <div className="w-[32rem]" data-testid="onboarding-element">
      {children[page]}
      <div className="flex justify-between mt-3">
        <div className="flex flex-row w-10 gap-1">
          {/* {children?.map((element: HTMLElement, index: number) =>
            <svg key={("svg-"+index)} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <circle fill={index === page ? '#262626' : '#A3A3A3'} cx="5" cy="5" r="5" />
            </svg>
          )} */}
        </div>
        <button
          className="bg-gray-800 hover:bg-gray-900 text-neutral-50 py-2 px-4 inline-flex items-center"
          onClick={(page !== children.length - 1 ? next : done)}>
          <span className="text-xs px-4">{page !== children.length - 1 ? 'Next' : 'Got It'}</span>
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
      <div>
        <div className=''>
          <h1 className="font-bold text-xl my-3">Connect to Filecoin Station with your filecoin address.</h1>
        </div>
        <div>
          <p className="text-sm my-3">Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. In facilisis, lorem quis posuere porttitor, sem purus ultrices risus, vitae eleifend purus arcu a nibh. Quisque quis ultrices tellus. Vivamus blandit, massa eu malesuada facilisis, quam elit faucibus metus,
            nec mollis arcu elit sit amet odio. </p>
        </div>
      </div>

      <div>
        <div>
          <h1 className="font-bold text-xl my-3">New modules are automatically installed in Station.</h1>
        </div>
        <div>
          <p className="text-sm my-3">Modules are independent services that can run on Station. The first module that Station will house is a Saturn node and the users will be able to earn FIL for contributing their resources and services to each module.</p>
        </div>
      </div>
    </Slider>
  )
}

export default Onboarding
