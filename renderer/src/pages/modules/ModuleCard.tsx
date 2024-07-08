import { ReactNode } from 'react'
import Tag from 'src/components/Tag'
import Text from 'src/components/Text'
import { Module } from 'src/hooks/StationModules'
import GithubIcon from 'src/assets/img/icons/github.svg?react'
import DocsIcon from 'src/assets/img/icons/docs.svg?react'
import ExplorerIcon from 'src/assets/img/icons/explorer.svg?react'
import { openExplorerLink } from 'src/lib/utils'
import { openExternalURL } from 'src/lib/station-config'

const ModuleLink = ({ children, onClick }: {children: ReactNode; onClick: () => void}) => (
  <Text
    as='button'
    type='button'
    size='xs'
    className='flex items-center gap-2'
    onClick={onClick}
  >
    {children}
  </Text>
)

const moduleStatus = {
  active: {
    tagStatus: 'primary',
    text: 'Active'
  },
  ended: {
    tagStatus: 'secondary',
    text: 'Ended'
  }
} as const

const ModuleCard = ({ module }: {module: Module}) => {
  return (
    <div className='bg-slate-50 border border-dashed border-slate-400 rounded-xl animate-fadeIn'>
      <div className='h-[276px] flex border-b border-dashed border-slate-400'>
        <div className='py-9 px-5 flex flex-col gap-3 justify-between'>
          <Text as='h2' size="l" font='mono'>{module.name}</Text>
          <Text as='p' size="xs" className='text-pretty no-overflow-text line-clamp-6'>
            {module.description}
          </Text>
          <div className='mt-auto'>
            <Tag type={moduleStatus[module.status].tagStatus}>{moduleStatus[module.status].text}</Tag>
          </div>
        </div>
        <figure
          className='flex w-[140px] shrink-0 py-9 px-5 border-l border-dashed border-slate-400 bg-white
          rounded-tr-xl'
        >
          <img src={module.logo} alt={`${module.name}'s logo`} className='max-w-[100px] m-auto' />
        </figure>
      </div>
      <div className='flex py-9 px-5'>
        <div className='w-3/5 flex flex-col gap-5'>
          <div className='flex flex-col'>
            <Text font='mono' size="3xs" color='primary' uppercase>&#47;&#47; Rewards given ... :</Text>
            <Text font='mono' size="xs">
              {module.stats.rewardsEnabled
                ? `${module.stats.totalRewards || '...'} FIL`
                : (<sub>coming soon</sub>)}
            </Text>
          </div>
          <div className='flex flex-col'>
            <Text font='mono' size="3xs" color='primary' uppercase>&#47;&#47; # Jobs done ... :</Text>
            <Text font='mono' size="xs">{module.stats.totalJobs || (<sub>coming soon</sub>)}</Text>
          </div>
        </div>
        <div className='flex flex-col gap-6 w-2/5'>
          <ModuleLink onClick={() => openExternalURL(module.links.github) }>
            <GithubIcon className='text-primary' />
            Github
          </ModuleLink>
          <ModuleLink onClick={() => openExternalURL(module.links.docs) }>
            <DocsIcon className='text-primary' />
            Docs
          </ModuleLink>
          <ModuleLink onClick={() => openExplorerLink(module.contractAddress) }>
            <ExplorerIcon className='text-primary' />
            Explorer
          </ModuleLink>
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
