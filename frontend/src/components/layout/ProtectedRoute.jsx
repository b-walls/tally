import { Navigate, useLocation } from 'react-router-dom'

import { Progress } from '../ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const [progress, setProgress] = useState(13);
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <div className='w-[40%] text-center flex flex-col gap-1'>
          <h1>Loading Tally...</h1>
          <Progress value={progress}/>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
