import { useModules } from 'src/hooks/StationModules'
import { openExplorerLink } from 'src/lib/utils'

const Modules = () => {
  const { modules } = useModules()

  return (
    <div>
      <h1>Modules</h1>

      <section className='flex flex-wrap gap-8'>
        {modules?.map(module => (
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
        ))}
      </section>
    </div>
  )
}

export default Modules
