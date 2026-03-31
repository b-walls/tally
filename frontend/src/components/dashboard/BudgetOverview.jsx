import React, {useEffect, useMemo, useState} from 'react'

const now = new Date();
const firstDayNextMonth = new Date(now.getFullYear(), (now.getMonth() + 1 % 12), 1)
const tilNextMonth = Math.floor((firstDayNextMonth - now) / 1000 / 60 / 60 / 24)

function BudgetOverview({ data, loading }) {
  return (
    <>
    {loading ? <div>loading</div> : 
    <>
    <div className='gap-3 my-3 md:flex flex-wrap mb-6 md:mb-3'>
      <div className="flex-col border-t-primary border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm hidden md:flex justify-evenly">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Budget health</h2></div>
        <h1 className='text-5xl py-1 text-primary'>Good</h1>
        <p className='text-text-muted'>3 on track · 1 over</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-primary rounded-md' style={{width: "72%"}}></div>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>72% of budgets healthy</p></div>
      </div>
      <div className="flex flex-col border-t-accent-2 border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Weekly Budgets</h2><span className='bg-accent-2-muted rounded-lg text-accent-2 px-2 max-h-6'>wkly</span></div>
        <h1 className='text-5xl py-1'>$77.37</h1>
        <p className='text-text-muted'>of $120 this week</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-accent-2 rounded-md' style={{width: "40%"}}></div>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>2 categories</p><p className='text-accent-2'>$42.63 left</p></div>
      </div>
      <div className="flex flex-col border-t-accent border-t-3 flex-1 border border-border bg-surface-raised rounded-lg p-5 shadow-sm justify-evenly mt-2 md:mt-0">
        <div className='flex gap-2'><h2 className='uppercase text-text-muted'>Monthly Budgets</h2><span className='bg-accent-muted rounded-lg text-accent px-2 max-h-6'>mo</span></div>
        <h1 className='text-5xl py-1'>$12.99</h1>
        <p className='text-text-muted'>of $160 this month</p>
        <div className='flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 my-2 rounded-md overflow-clip'>
          <div className='bg-accent rounded-md' style={{width: "10%"}}></div>
        </div>
        <div className='flex justify-between flex-wrap'><p className='text-text-muted'>2 categories</p><p className='text-accent'>$42.63 left</p></div>
      </div>
    </div>

    </>
    } 
    </>
  )
}

export default BudgetOverview