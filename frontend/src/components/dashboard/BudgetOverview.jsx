import React, {useEffect, useMemo, useState} from 'react'

function getDataInsights(data) {
  console.log(data);
  const largest = {category: "", spent: -Infinity}
  let withinBudget = 0;
  let numBudgetedCategories = 0;

  data.budget.forEach((item) => {
    // largest tracking
    const currNum = parseFloat(item.limit) - parseFloat(item.remaining);
    if (currNum > largest.spent) {
      largest.category = item.category;
      largest.spent = currNum;
    }

    if (item.limit > 0) {
      withinBudget += item.remaining < 0 ? 0 : 1;
      numBudgetedCategories += 1;
    }
  })
  
  const totalSpending = data.expenses.data.reduce((accum, curr) => {
    accum += curr.total;
    return accum;
  }, 0)

  return {largest: largest, withinBudget: withinBudget, numBudgeted: numBudgetedCategories, monthlySpending: totalSpending}
}

const now = new Date();
const firstDayNextMonth = new Date(now.getFullYear(), (now.getMonth() + 1 % 12), 1)
const tilNextMonth = Math.floor((firstDayNextMonth - now) / 1000 / 60 / 60 / 24)

function BudgetOverview({ data, loading }) {
  const [dataInsights, setDataInsights] = useState({largest: {category: "", spent: -Infinity}, withinBudget: 0, numBudgeted: 0, monthlySpending: 0});

  useEffect(() => {

  }, [])

  useMemo(() => {
    if (loading) return [];
    const dataInsights = getDataInsights(data);
    setDataInsights(dataInsights);
  }, [data, loading]);
    
    

  return (
    <>
    {loading ? <div>loading</div> : 
    <>
    <div className='gap-3 my-3 hidden md:flex'>
      <div className={`flex flex-col flex-1 border-t-2 border border-border bg-surface-raised rounded-lg p-5 shadow-sm ${dataInsights.withinBudget > (0.5 * dataInsights.numBudgeted) ? "border-t-danger" : "border-t-success"}`}>
        
      </div>
      <div className='flex flex-col flex-1 justify-evenly border-t-2 border-t-blue-400 border border-border bg-surface-raised rounded-lg p-5 shadow-sm'>
        <p className='mb-1 text-text-muted'>Largest category</p>
        <h1 className="text-[clamp(2rem,3vw,5rem)]">{dataInsights.largest.category}</h1>
        <p className='text-text-muted'>${(dataInsights.largest.spent).toFixed(2)} spent</p>
      </div>
    </div>
    {/* <div className='py-5 md:py-0'>
        <div className='flex flex-col md:hidden bg-surface-raised rounded-2xl p-5 border border-border shadow-md'>
          <h2 className='text-primary uppercase'>Remaining this month</h2>
          {totalRemaining > 0 ? <h1 className='text-[clamp(2rem,3vw,5rem)] text-success'>${totalRemaining.toFixed(2)}</h1> : <h1 className='text-[clamp(2rem,3vw,5rem)] text-danger'>-${(totalRemaining * -1).toFixed(2)}</h1>}
          <p className='text-text-muted mb-3'>of ${totalBudget.toFixed(2)} budget</p>
          <div className='bg-surface-raised-2 rounded-md mb-2'>
            <div className='bg-primary h-3 rounded-md' style={{width: totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) + "%" : "100%"}}/>
          </div>
          <div className='flex justify-between'>
            <p className='text-text-muted'>${totalSpent.toFixed(2)} spent</p>
            {totalRemaining > 0 ? <p className='text-text-muted'>~ ${(totalRemaining/tilNextMonth).toFixed(2)}/day left</p> : <p className='text-text-muted'>$0/day left</p>}
          </div>
        </div>
    </div> */}
    </>
    } 
    </>
  )
}

export default BudgetOverview