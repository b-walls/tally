import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutCallback = async () => {
    await logout();
    navigate('/login');
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
