import { useAuth } from "../contexts/AuthContext"

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="bg-surface-raised">Hi, {user.first_name}</div>
  )
}

export default DashboardPage
