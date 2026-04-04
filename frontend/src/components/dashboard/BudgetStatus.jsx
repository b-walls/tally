import React, { useMemo } from 'react'

const COLORS = {primary: "#a78bfa", textDanger: "#f87171", text: "#f5f5f5", success: "#4ade80", textMuted: "#888888"}

function Bar({item}) {
  const spent = item.spent;
  const width = Math.max(3, Math.min(100, ((spent) / item.limit * 100)))
  return (
    <>
      <div className='flex justify-between mb-1'>
        <p>{item.category}</p>
        <p className={`${item.remaining <= 0 ? "text-danger" : "text-text-muted"}`}>${spent.toFixed(2)} / ${item.limit.toFixed(2)}</p>
      </div>
      <div className="flex-1 width-full bg-surface-raised-2 rounded-3xl">
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
      return data.filter((item) => item.limit > 0);
    }, [data, loading]);
   
  
  return (
    <div className='flex flex-col flex-1 bg-surface-raised border border-border rounded-lg p-4 gap-2'>
      <h1 className='text-2xl mb-3'>Budget status</h1>
      {
      loading ? 
        <p>loading...</p> 
      :
        extractedData.map((item, index) => (
          <div key={index}>
            <Bar item={item}/>
          </div>
        ))
      }
    </div>
  )
}

export default BudgetBars