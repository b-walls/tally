import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext"
import { Scan, Plus } from 'lucide-react'

import BudgetOverview from "../components/dashboard/BudgetOverview";
import BudgetStatus from "../components/dashboard/BudgetStatus";
import RecentExpenses from "../components/dashboard/RecentExpenses";

import { getExpenseRange, getExpenseRecent } from "../api/expense";
import { getRemaining } from "../api/budget"; 
import { getWeekRange, getMonthRange } from "../utils/date";
import DashboardChart from "@/components/dashboard/DashboardChart";

const [startOfWeek, endOfWeek] = getWeekRange();
const [startOfMonth, endOfMonth] = getMonthRange();

const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour > 4 && hour < 12) return "Good morning";
  if (hour <= 17) return "Good afternoon";
  return "Good evening";
};

const getHeaderDateStr = () => {
  const now = new Date();
  const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const tilNextMonth = Math.floor((firstDayNextMonth - now) / 1000 / 60 / 60 / 24)

  return (now.toLocaleDateString('default', { month: 'long', year: 'numeric' }) 
    + " · " + tilNextMonth + " days left") 
}

const headerDateStr = getHeaderDateStr();
const greeting = getGreeting();

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [remaingBudgetData, setRemaingBudgetData] = useState([]);
  const [expenseWeekRangeData, setExpenseWeekRangeData] = useState();
  const [expenseMonthRangeData, setExpenseMonthRangeData] = useState();
  const [expenseRecentData, setExpenseRecentData] = useState();

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [remaining, expensesWeekRange, expensesMonthRange, expensesRecent] = await Promise.all([
          getRemaining(),
          getExpenseRange(startOfWeek, endOfWeek),
          getExpenseRange(startOfMonth, endOfMonth),
          getExpenseRecent()
        ]);

        setRemaingBudgetData(remaining);
        setExpenseWeekRangeData({startDate: startOfWeek, endDate: endOfWeek, data: expensesWeekRange});
        setExpenseMonthRangeData({startDate: startOfMonth, endDate: endOfMonth, data: expensesMonthRange});
        setExpenseRecentData(expensesRecent);
        console.log(expensesRecent);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    
  }, [])

  return (
    <div className="bg-surface min-h-full p-5 md:p-10 flex flex-col select-none">
      <div className="flex justify-between gap-2 flex-wrap items-center md:mb-2">
        <div>
          <h1 className="text-xl">{greeting}, {user.first_name}</h1>
          <p className="text-text-muted">
            {headerDateStr}
          </p>
        </div>
        <div className="gap-3 hidden md:flex">
          <Link to="expenses/scan" className="border border-border bg-surface-raised rounded-lg p-3 flex gap-2 transition-all duration-300 hover:bg-surface-raised-2"> <Scan/> Scan receipt</Link>
          <Link to="expenses/log" className="border border-border bg-primary text-background rounded-lg p-3 flex gap-2 transition-all duration-300 hover:bg-primary/80"> <Plus/> Log expense</Link>
        </div>
      </div>
      <BudgetOverview data={remaingBudgetData} loading={loading}/>
      <div className="gap-3 flex pb-5 md:hidden md:pb-0">
        <Link to="expenses/scan" className="border border-border bg-surface-raised rounded-lg p-3 flex gap-2 flex-1 items-center"> <Scan/> Scan receipt</Link>
        <Link to="expenses/log" className="border border-border bg-primary text-background rounded-lg p-3 bg-linear-to-tl from-primary to-primary-hover  flex gap-2 flex-1 items-center">
          <Plus/>Log expense
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        <DashboardChart weekData={expenseWeekRangeData} monthData={expenseMonthRangeData} loading={loading}/>
        <BudgetStatus data={remaingBudgetData} loading={loading}/>
      </div>
      <RecentExpenses data={expenseRecentData} loading={loading}/>
    </div>
  )
}

export default DashboardPage
