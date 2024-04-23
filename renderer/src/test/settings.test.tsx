import { render } from '@testing-library/react'
import { isOpenAtLogin } from 'src/lib/station-config'
import Settings from 'src/pages/settings/Settings'
import { describe, expect, test, vi } from 'vitest'

vi.mock('src/lib/station-config')

describe('Settings page', () => {
  beforeAll(() => {
    vi.mocked(isOpenAtLogin).mockReturnValue(Promise.resolve(true))

    render(<Settings />)
  })

  test('Shows openAtLogin initial state correctly', () => {
    expect(document.querySelector<HTMLInputElement>('input[name="isOpenAtLogin"]')?.checked).toBe(true)
  })
})
