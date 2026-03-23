import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AppLayout() {
  const { logout } = useAuth();
  
  const logoutCallback = () => {
    logout();
  }

  return (
    <div>
      <nav>
        <button onClick={logoutCallback}>
          logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
