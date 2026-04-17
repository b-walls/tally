import React, { useMemo } from 'react'
import { Skeleton } from '../ui/skeleton';


const COLORS = {primary: "#a78bfa", textDanger: "#f87171", text: "#f5f5f5", success: "#4ade80", textMuted: "#888888"}

function Bar({item}) {
  const spent = item.spent;
  const width = Math.max(1, Math.min(100, ((spent) / item.limit * 100)))
  if (item.limit <= 0) {
    return (
    <>
      <div className='flex justify-between mb-0.5'>
        <p className='text-text-muted'>{item.category}</p>
        <p className="text-text-muted">Not budgeted</p>
      </div>
      <div className="flex-1 width-full bg-surface-raised-2 rounded-3xl mb-1">
        <div className="h-2 rounded-3xl w-[0%] bg-text-muted">
        </div>
      </div>
    </>
  )
  }
  return (
    <>
      <div className='flex justify-between mb-0.5'>
        <p>{item.category}</p>
        <p className={`${item.remaining <= 0 ? "text-danger" : "text-text-muted"}`}>${spent.toFixed(2)} / ${item.limit.toFixed(2)}</p>
      </div>
      <div className="flex-1 width-full bg-surface-raised-2 rounded-3xl mb-1">
        <div className={`h-2 rounded-3xl ${item.remaining <= 0 ? "bg-red-500" : "bg-primary"}`}
             style={{ width: `${width}%` }}>
        </div>
      </div>
    </>
  )
}

function BudgetBars({data, loading}) {

  const extractedData = useMemo(() => {
      if (loading) return [];
      return [...data].sort((a, b) => b.limit - a.limit);
    }, [data, loading]);
   
  
  return (
    <div className='flex flex-col flex-1 bg-surface-raised border border-border rounded-lg p-4'>
      <h1 className='text-2xl mb-5'>Budget status</h1>
      {
      loading ? 
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto justify-evenly">
          {Array.from({length: 7}, (_, i) => (
            <div key={i}>
              <div className='flex justify-between mb-0.5'>
                <Skeleton className="h-3 w-[10%] rouned-xl my-1"/>
                <Skeleton className="h-3 w-[20%] rounded-xl my-1"/>
              </div>
              <div className="flex-1 width-full bg-surface-raised-2 rounded-3xl mb-1 mt-1">
                <Skeleton className="w-full h-2 rounded-3xl"/>
              </div>
            </div>
          ))}
        </div>
      :
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto justify-evenly">
          {extractedData.map((item, index) => (
            <div key={index}>
              <Bar item={item}/>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default BudgetBars