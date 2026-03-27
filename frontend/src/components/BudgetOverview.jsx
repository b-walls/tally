import React from 'react'

function BudgetOverview({ data }) {

  // get spent, remaining, total
  function getBudgetOverviewFromData(data) {

    const totals = data.reduce((accum, item) => {
      accum[0] += parseFloat(item.limit);
      accum[1] += parseFloat(item.remaining);
      return accum
    }, [0, 0]);

    const [totalBudget, totalRemaining] = totals
    const totalSpent = totalBudget - totalRemaining;

    return [totalSpent, totalRemaining, totalBudget];
  }

  function getLargestCategory(data) {
    const largest = {category: "", spent: -Infinity}

    data.forEach((item) => {
      const currNum = parseFloat(item.limit) - parseFloat(item.remaining);
      if (currNum > largest.spent) {
        largest.category = item.category;
        largest.spent = currNum;
      }
    })
    
    return largest
  }
  
  const now = new Date();
  const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const tilNextMonth = Math.floor((firstDayNextMonth - now) / 1000 / 60 / 60 / 24)

  const [totalSpent, totalRemaining, totalBudget] = getBudgetOverviewFromData(data);
  const largestCategory = getLargestCategory(data);

  return (
    <>
    <div className='gap-5 my-3 hidden md:flex'>
      <div className='flex flex-col flex-1 border bg-surface-raised border-border rounded-lg p-5 shadow-sm'>
        <p className='mb-1 text-text-muted'>Spent this month</p>
        <div>
          <h1 className="text-[clamp(2rem,3vw,5rem)]">${totalSpent}</h1>
          <p className='text-text-muted'>of ${totalBudget} budget</p>
        </div>
      </div>
      <div className='flex flex-col justify-between flex-1 border bg-surface-raised border-border rounded-lg p-5 shadow-sm'>
        <p className='mb-1 text-text-muted'>Remaining</p>
        {
          totalRemaining > 0 ? 
          <div>
          <h1 className='text-success text-[clamp(2rem,3vw,5rem)]'>${totalRemaining}</h1> 
          <p className='text-text-muted'>~ ${totalRemaining/tilNextMonth}/day left</p>
          </div>
          : 
          <div>
          <h1 className='text-danger text-[clamp(2rem,3vw,5rem)]'>-${totalRemaining * -1}</h1>
          <p className='text-text-muted'>~ $0/day left</p>
          </div>
        }
        
      </div>
      <div className='flex flex-col flex-1 border bg-surface-raised border-border rounded-lg p-5 shadow-sm'>
        <p className='mb-1 text-text-muted'>Largest category</p>
        <div>
          <h1 className="text-[clamp(2rem,3vw,5rem)]">{largestCategory.category}</h1>
          <p className='text-text-muted'>${largestCategory.spent} spent</p>
        </div>
      </div>
    </div>
    <div className='py-5 md:py-0'>
        <div className='flex flex-col md:hidden bg-surface-raised rounded-2xl p-5 border border-border shadow-md'>
          <h2 className='text-primary uppercase'>Remaining this month</h2>
          {totalRemaining > 0 ? <h1 className='text-[clamp(2rem,3vw,5rem)] text-success'>${totalRemaining}</h1> : <h1 className='text-[clamp(2rem,3vw,5rem)] text-danger'>-${totalRemaining * -1}</h1>}
          <p className='text-text-muted mb-3'>of ${totalBudget} budget</p>
          <div className='bg-surface-raised rounded-md'>
            <div className='bg-primary h-1 rounded-md' style={{width: totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) + "%" : "100%"}}/>
          </div>
          <div className='flex justify-between'>
            <p className='text-text-muted'>${totalSpent} spent</p>
            {totalRemaining > 0 ? <p className='text-text-muted'>~ ${totalRemaining/tilNextMonth}/day left</p> : <p className='text-text-muted'>$0/day left</p>}
          </div>
        </div>
    </div>
    </>
  )
}

export default BudgetOverview