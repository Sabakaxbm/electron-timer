import { HashRouter, Routes, Route } from 'react-router-dom'
import Timer from '@renderer/ui/Timer'
import { SettingsLayout } from '@renderer/ui/settings/settings-layout'

export default function AppProvider() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/settings" element={<SettingsLayout />} />
      </Routes>
    </HashRouter>
  )
}
