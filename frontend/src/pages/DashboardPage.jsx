import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"



function DashboardPage() {
  const { user } = useAuth();

  const getGreeting = (now) => {
    const hour = now.getHours();
    if (hour > 4 && hour < 12) return "Good morning";
    if (hour <= 17) return "Good afternoon";
    return "Good evening";
  };

  const getHeaderDateStr = (now) => {
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const tilNextMonth = Math.floor((firstDayNextMonth - now) / 1000 / 60 / 60 / 24)

    return (now.toLocaleDateString('default', { month: 'long', year: 'numeric' }) 
      + " • " + tilNextMonth + " days left") 
  }

  const now = new Date();
  const greeting = getGreeting(now);
  const headerDateStr = getHeaderDateStr(now)

  return (
    <div className="bg-surface-raised h-full p-10">
      <div className="flex justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl">{greeting}, {user.first_name}</h1>
          <p className="text-text-muted">
            {headerDateStr}
          </p>
        </div>
        <div>
          <Link to="expenses/scan" className="border border-border rounded-md p-2">Scan receipt</Link>
          <Link to="expenses/log">Log expense</Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
