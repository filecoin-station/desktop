import classNames from 'classnames'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import BorderedBox from 'src/components/BorderedBox'
import Tag from 'src/components/Tag'
import Text from 'src/components/Text'
import { Module } from 'src/hooks/StationModules'

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
                    <Text font='mono' size="3xs" color='primary' uppercase>// Rewards given ... :</Text>
                    <Text font='mono' size="xs">{module.stats.totalRewards}</Text>
                </div>
                <div className='flex flex-col'>
                    <Text font='mono' size="3xs" color='primary' uppercase>// #Jobs done ... :</Text>
                    <Text font='mono' size="xs">{module.stats.totalJobs}</Text>
                </div>
            </section>
            <section className='flex flex-col gap-6 w-2/5'>
                <Text as='a' size='xs' href={module.links.github}>Github</Text>
                <Text as='a' size='xs' href={module.links.docs}>Docs</Text>
                <Text as='a' size='xs' href={module.links.github}>Explorer</Text>
            </section>
        </InnerSection>
    </div>
  )
}

export default ModuleCard
