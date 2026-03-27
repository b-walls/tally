import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRemaining } from "../api/budget"; 
import { useAuth } from "../contexts/AuthContext"
import { Scan, Plus } from 'lucide-react'

import BudgetOverview from "../components/BudgetOverview";
import BarChart from "../components/BarChart"

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRemaining();
        setData(response);
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
  }, [])

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
    <div className="bg-surface min-h-full p-5 md:p-10">
      <div className="flex justify-between gap-2 flex-wrap items-center">
        <div>
          <h1 className="text-xl">{greeting}, {user.first_name}</h1>
          <p className="text-text-muted">
            {headerDateStr}
          </p>
        </div>
        <div className="gap-3 hidden md:flex">
          <Link to="expenses/scan" className="border border-border bg-surface-raised rounded-lg p-3 flex gap-2"> <Scan/> Scan receipt</Link>
          <Link to="expenses/log" className="border border-border bg-primary text-background rounded-lg p-3 bg-linear-to-b from-primary to-primary-hover flex gap-2"> <Plus/> Log expense</Link>
        </div>
      </div>
      <BudgetOverview data={data}/>
      <div className="gap-3 flex pb-5 md:hidden md:pb-0">
        <Link to="expenses/scan" className="border border-border bg-surface-raised rounded-lg p-3 flex gap-2 flex-1 items-center"> <Scan/> Scan receipt</Link>
        <Link to="expenses/log" className="border border-border bg-primary text-background rounded-lg p-3 bg-linear-to-tl from-primary to-primary-hover  flex gap-2 flex-1 items-center">
          <Plus/>Log expense
        </Link>
      </div>
      <BarChart/>
    </div>
  )
}

export default DashboardPage
