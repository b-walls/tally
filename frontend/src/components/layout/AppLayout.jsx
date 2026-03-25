import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'; 

export default function AppLayout() {
  return (
    <div className="flex flex-col-reverse md:flex-row">
      <nav>
        <Navbar />
      </nav>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}
