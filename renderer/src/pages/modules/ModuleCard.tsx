import classNames from 'classnames'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import Tag from 'src/components/Tag'
import Text from 'src/components/Text'
import { Module } from 'src/hooks/StationModules'
import GithubIcon from 'src/assets/img/icons/github.svg?react'
import DocsIcon from 'src/assets/img/icons/docs.svg?react'
import ExplorerIcon from 'src/assets/img/icons/explorer.svg?react'
import { openExplorerLink } from 'src/lib/utils'
import { openExternalURL } from 'src/lib/station-config'

const InnerSection = ({
  children,
  ...props
}: {
    children: ReactNode;
} & ComponentPropsWithoutRef<'div'>) => (
    <div className={classNames('py-9 px-5', props.className)}>
        {children}
    </div>
)

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

const tagStatus = {
  active: 'primary',
  deprecated: 'secondary',
  comingSoon: 'dashed'
} as const

const ModuleCard = ({ module }: {module: Module}) => {
  return (
    <div className='flex flex-wrap bg-slate-50 border border-dashed border-slate-400 rounded-xl'>
        <InnerSection className='w-2/3 border-b border-dashed border-slate-400'>
            <Text as='h2' size="l" className='mb-3'>{module.name}</Text>
            <Text as='p' size="xs" className='mb-3'>{module.description}</Text>
            <Tag type={tagStatus[module.status]}>{module.status}</Tag>
        </InnerSection>
        <InnerSection className='w-1/3 self-stretch border-l border-b border-dashed border-slate-400 flex'>
            <img src={module.logo} alt={`${module.name}'s logo`} className='max-w-[100px] m-auto' />
        </InnerSection>
        <InnerSection className='flex w-full'>
            <section className='w-3/5 flex flex-col gap-5'>
                <div className='flex flex-col'>
                    <Text font='mono' size="3xs" color='primary' uppercase>&#47;&#47; Rewards given ... :</Text>
                    <Text font='mono' size="xs">{module.stats.totalRewards}</Text>
                </div>
                <div className='flex flex-col'>
                    <Text font='mono' size="3xs" color='primary' uppercase>&#47;&#47; # Jobs done ... :</Text>
                    <Text font='mono' size="xs">{module.stats.totalJobs}</Text>
                </div>
            </section>
            <section className='flex flex-col gap-6 w-2/5'>
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
            </section>
        </InnerSection>
    </div>
  )
}

export default ModuleCard
