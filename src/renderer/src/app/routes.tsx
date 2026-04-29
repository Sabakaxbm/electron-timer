import { HashRouter, Routes, Route } from 'react-router-dom'
import Timer from '@renderer/ui/Timer'
import Settings from '@renderer/ui/settings'

export default function AppProvider() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  )
}
