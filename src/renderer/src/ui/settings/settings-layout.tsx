import Settings from '@renderer/ui/settings/settings'
import './settings.css'
import { Scrollable } from '@renderer/shared/ui/scroll/scroll'

export function SettingsLayout() {
  return (
    <Scrollable className="settings">
      <Settings />
    </Scrollable>
  )
}
