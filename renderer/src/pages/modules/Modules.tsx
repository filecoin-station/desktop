import { useModules } from 'src/hooks/StationModules'
import ModuleCard from './ModuleCard'
import Text from 'src/components/Text'

const Modules = () => {
  const { modules } = useModules()

  return (
    <main className='px-9 mt-28 flex flex-col w-[1000px] max-w-full mx-auto'>
      <header className='mb-9'>
        <Text as='h1' font='mono' size='xs' color='primary' uppercase>&#47;&#47; Modules ... :</Text>
      </header>
      <section className='grid gap-8 grid-cols-2'>
        {modules?.map(module => <ModuleCard module={module} key={module.id} />)}
      </section>
    </main>
  )
}

export default Modules
