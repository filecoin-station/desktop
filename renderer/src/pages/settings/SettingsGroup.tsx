import { ReactNode } from 'react'
import Text from 'src/components/Text'

export const SettingsGroupItem = (
  {
    title,
    description,
    input
  }: {
    title: string;
    description?: string;
    input: ReactNode;
  }
) => {
  return (
    <div className='flex py-5 px-9 justify-between items-center
                    first:rounded-t-lg last:rounded-b-lg bg-slate-50
                    border border-dashed border-slate-400 border-t-0 first:border-t'
    >
      <div className='flex flex-col gap-3 max-w-[485px]'>
        <Text size='s' bold>{title}</Text>
        {description && (
          <Text size='s'>{description}</Text>
        )}
      </div>
      {input}
    </div>
  )
}

const SettingsGroup = (
  {
    name,
    children
  }: {
    name: string;
    children: ReactNode;
  }) => {
  return (
    <section>
      <Text as='h2' font='body' size='m' className='mb-5'>{name}</Text>
      <div>
        {children}
      </div>
    </section>
  )
}

export default SettingsGroup
