import { FC } from 'react'

const SkeletonLoading: FC = () => {
  return (
    <div className='w-full h-8 rounded-md
       bg-gradient-to-r from-[#ffffff00] via-[#ffffff57] to-[#ffffff00]
       bg-repeat-y bg-[length:50px_100px] bg-left-top
       animate-[shine_1s_ease_infinite]
       bg-grayscale-400 bg-opacity-80'></div>
  )
}

export default SkeletonLoading
