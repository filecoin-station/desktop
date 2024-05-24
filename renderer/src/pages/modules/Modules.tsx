import { useModules } from 'src/hooks/StationModules'
import { openExplorerLink } from 'src/lib/utils'
import ModuleCard from './ModuleCard'
import Text from 'src/components/Text'

const Modules = () => {
  const { modules } = useModules()

  return (
    <div className='w-[928px] max-w-full'>
        <header className='mb-9'>
          <Text as='h1' font='mono' size='xs' color='primary' uppercase>// Modules ... :</Text>
        </header>
      <section className='grid gap-8 grid-cols-2 grid-flow-col'>
        {modules?.map(module => <ModuleCard module={module} key={module.id} />)}
        {/* {modules?.map(module => (
          <div key={module.id} className='w-1/3'>
            <div className='mb-4'>
              <h2 className='font-bold'>{module.name}</h2>
              <p>{module.description}</p>
            </div>

            <img src={module.logo} alt={module.name} className='w-48' />

            <div className='flex gap-8'>
              <div className=''>
                <div>
                  <span>Rewards given</span>
                  <p>{module.stats.totalRewards}</p>
                </div>
                <div>
                  <span>Jobs done</span>
                  <p>{module.stats.totalJobs}</p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <a href={module.links.github}>Github</a>
                <a href={module.links.docs}>Docs</a>
                <button onClick={() => openExplorerLink(module.contractAddress)} type='button'>Explorer</button>
              </div>
            </div>
          </div>
        ))} */}
      </section>
    </div>
  )
}

export default Modules
