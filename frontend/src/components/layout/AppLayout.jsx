import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'; 

export default function AppLayout() {
  return (
    <div className="flex flex-col-reverse md:flex-row h-screen">
      <nav>
        <Navbar />
      </nav>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
