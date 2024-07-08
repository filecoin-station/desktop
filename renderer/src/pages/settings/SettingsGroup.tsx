import { ReactNode } from 'react'
import BorderedBox from 'src/components/BorderedBox'
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
    <BorderedBox className='flex justify-between items-center py-5 px-9' isGrouped>
      <div className='flex flex-col gap-3 max-w-[485px]'>
        <Text size='s' bold>{title}</Text>
        {description && (
          <Text size='s'>{description}</Text>
        )}
      </div>
      {input}
    </BorderedBox>
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
