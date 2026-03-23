import { useAuth } from "../contexts/AuthContext"

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>Hi, {user.first_name}</div>
  )
}

export default DashboardPage
