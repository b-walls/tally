import React, {useMemo} from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function getBudgetData(data, period) {
  const budgets = data.filter((item) => item.period === period && item.limit > 0);
  const totalSpent = budgets.reduce((accum, item) => accum += item.spent, 0)
  const totalLimit = budgets.reduce((accum, item) => accum += item.limit, 0)

  let percentageUsed = Math.max(1, Math.min(100, ((totalSpent) / totalLimit * 100)))
  if (isNaN(percentageUsed)) {
    percentageUsed = 1;
  }
  percentageUsed = percentageUsed + "%";
  return {size: budgets.length, spent: totalSpent, limit: totalLimit, used: percentageUsed, left: totalLimit - totalSpent}
}

function getBudgetHealth(data) {
  const total = data.filter((item) => (item.limit > 0)).length;
  const onTrack = data.filter((item) => (item.spent < item.limit)).length;
  const ratio = onTrack / total;

  let health = "";
  let color = "00d4aa";
  let infoStr = "";
  if (ratio == 1) {
    health = "Good"
    color = "#00d4aa"
    infoStr = `${total} on track`
  } else if (ratio > 0.5) {
    health = "At risk"
    color = "#fbbf24"
    infoStr = `${total} on track · ${total - onTrack} over`
  } else {
    health = "Bad"
    color = "#f87171"
    infoStr = `${total} on track · ${total - onTrack} over`
  }
  return {health: health, onTrack: onTrack, total: total, ratio: ratio, color: color, infoStr: infoStr}
}


function BudgetOverview({ data, loading }) {
  const weeklyBudget = useMemo(() => getBudgetData(data, "weekly"), [data]);
  const monthlyBudget = useMemo(() => getBudgetData(data, "monthly"), [data]);
  const budgetHealth = useMemo(() => getBudgetHealth(data), [data]);

  if (loading) {
    return (
      <div className='gap-3 my-3 md:flex flex-wrap mb-6 md:mb-3'>
      <div className="flex-col border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm hidden md:flex justify-evenly">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Budget health</h2></div>
        <Skeleton className='h-10 my-2 w-[40%] rounded-xl' style={{animationDelay: "-0.0s"}}/>
        <Skeleton className='h-4 w-[30%] rounded-xl my-1' style={{animationDelay: "-0.3s"}}/>
        <Skeleton className='flex flex-1 min-h-2 max-h-2 my-2 rounded-md overflow-clip' style={{animationDelay: "-0.6s"}}/>
        <Skeleton className='h-4 w-[50%] rounded-xl my-1' style={{animationDelay: "-0.9s"}}/>
      </div>

      <div className="flex flex-col border-t-accent-2 border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Weekly Budgets</h2><span className='bg-accent-2-muted rounded-lg text-accent-2 px-2 max-h-6'>wkly</span></div>
        <Skeleton className='h-10 my-2 w-[40%] rounded-xl' style={{animationDelay: "-0.2s"}}/>
        <Skeleton className='h-4 w-[30%] rounded-xl my-1' style={{animationDelay: "-0.5s"}}/>
        <Skeleton className='flex flex-1 min-h-2 max-h-2 my-2 rounded-md overflow-clip' style={{animationDelay: "-0.8s"}}/>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-[30%] rounded-xl my-1' style={{animationDelay: "-1.1s"}}/>
          <Skeleton className='h-4 w-[20%] rounded-xl my-1' style={{animationDelay: "-1.4s"}}/>
        </div>
      </div>

      <div className="flex flex-col border-t-accent border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly mt-2 md:mt-0">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Monthly Budgets</h2><span className='bg-accent-muted rounded-lg text-accent px-2 max-h-6'>mo</span></div>
        <Skeleton className='h-10 my-2 w-[40%] rounded-xl' style={{animationDelay: "-0.3s"}}/>
        <Skeleton className='h-4 w-[30%] rounded-xl my-1' style={{animationDelay: "-0.7s"}}/>
        <Skeleton className='flex flex-1 min-h-2 max-h-2 my-2 rounded-md overflow-clip' style={{animationDelay: "-1.0s"}}/>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-[30%] rounded-xl my-1' style={{animationDelay: "-1.3s"}}/>
          <Skeleton className='h-4 w-[20%] rounded-xl my-1' style={{animationDelay: "-1.6s"}}/>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className='gap-3 my-3 md:flex flex-wrap mb-6 md:mb-3'>
      <div className="flex-col border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm hidden md:flex justify-evenly"
        style={{borderTopColor: budgetHealth.color}}
      >
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Budget health</h2></div>
        <h1 className='text-5xl py-1'
          style={{color: budgetHealth.color}}
        >
          {budgetHealth.health}
        </h1>
        <p className='text-text-muted'>{budgetHealth.infoStr}</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-primary rounded-md' 
          style={{width: (budgetHealth.ratio * 100) + "%", backgroundColor: budgetHealth.color}}/>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>{(budgetHealth.ratio * 100).toFixed(2)}% of budgets healthy</p></div>
      </div>

      <div className="flex flex-col border-t-accent-2 border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Weekly Budgets</h2><span className='bg-accent-2-muted rounded-lg text-accent-2 px-2 max-h-6'>wkly</span></div>
        <h1 className='text-5xl py-1'>${weeklyBudget.spent.toFixed(2)}</h1>
        <p className='text-text-muted'>of ${weeklyBudget.limit.toFixed(2)} this week</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-accent-2 rounded-md' style={{width: weeklyBudget.used }}></div>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>{weeklyBudget.size} categories</p><p className='text-accent-2'>${weeklyBudget.left.toFixed(2)} left</p></div>
      </div>

      <div className="flex flex-col border-t-accent border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly mt-2 md:mt-0">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Monthly Budgets</h2><span className='bg-accent-muted rounded-lg text-accent px-2 max-h-6'>mo</span></div>
        <h1 className='text-5xl py-1'>${monthlyBudget.spent}</h1>
        <p className='text-text-muted'>of ${monthlyBudget.limit} this month</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-accent rounded-md' style={{width: monthlyBudget.used}}></div>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>{monthlyBudget.size} categories</p><p className='text-accent'>${monthlyBudget.left} left</p></div>
      </div>
    </div>
  )
}

export default BudgetOverview