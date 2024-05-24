import { useEffect, useState } from 'react'
import Text from 'src/components/Text'
import {
  checkForUpdates,
  exportSeedPhrase,
  isOpenAtLogin,
  saveModuleLogsAs,
  toggleOpenAtLogin
} from 'src/lib/station-config'
import SettingsGroup, { SettingsGroupItem } from './SettingsGroup'
import SwitchInput from 'src/components/SwitchInput'
import Button from 'src/components/Button'
import UpdateIcon from 'src/assets/img/icons/update.svg?react'
import SaveIcon from 'src/assets/img/icons/save.svg?react'
import ExportIcon from 'src/assets/img/icons/export.svg?react'

const Settings = () => {
  const [isOpenAtLoginChecked, setIsOpenAtLoginChecked] = useState(true)

  const updateIsOpenAtLogin = async () => setIsOpenAtLoginChecked(await isOpenAtLogin())

  async function handleClick () {
    toggleOpenAtLogin()
    setIsOpenAtLoginChecked(!isOpenAtLoginChecked)
  }

  useEffect(() => {
    updateIsOpenAtLogin()
  }, [])

  return (
    <div className='flex flex-col self-center w-[928px] max-w-full'>
      <header className='mb-9'>
        <Text as='h1' font='mono' size='xs' color='primary' uppercase>&#47;&#47; Settings ... :</Text>
      </header>
      <div className='flex flex-col gap-7'>
        <SettingsGroup name='General'>
          <SettingsGroupItem
            title='Start at login'
            input={
              <SwitchInput
                name="openAtLogin"
                onChange={handleClick}
                checked={isOpenAtLoginChecked}
              />
            }
          />
          <SettingsGroupItem
            title='Updates'
            description='Check for updates regularly to ensure your software is running smoothly and securely.'
            input={
              <Button
                type='button'
                variant='secondary'
                icon={<UpdateIcon />}
                onClick={checkForUpdates}
              >
                  Check for updates
              </Button>
            }
          />
          <SettingsGroupItem
            title='Module logs'
            description={`Saving module logs in the Station app helps users track 
            and diagnose issues, providing insights into the performance of individual 
            components for effective troubleshooting.`}
            input={
              <Button
                type='button'
                variant='secondary'
                icon={<SaveIcon />}
                onClick={saveModuleLogsAs}
              >
                  Save module logs as...
              </Button>
            }
          />
        </SettingsGroup>
        <SettingsGroup name='Security'>
          <SettingsGroupItem
              title='Seed phrase'
              description={`Export your seed phrase for safekeeping, 
              allowing you to recover your cryptocurrency assets if necessary.`}
              input={
                <Button
                  type='button'
                  variant='secondary'
                  icon={<ExportIcon />}
                  onClick={exportSeedPhrase}
                >
                    Export seed phrase
                </Button>
              }
          />
        </SettingsGroup>
      </div>
    </div>
  )
}

export default Settings
