import { useAuth } from "../contexts/AuthContext"

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="bg-surface-raised h-full">Hi, {user.first_name}</div>
  )
}

export default DashboardPage
