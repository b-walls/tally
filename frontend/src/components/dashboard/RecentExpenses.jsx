import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { sameDay } from '../../utils/date'
import { Skeleton } from '../ui/skeleton'

function getDayString(item) {
	const date = new Date(item.date + "T00:00:00");
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	if (sameDay(date, today)) {
		return "Today";
	} else if (sameDay(date, yesterday)) {
		return "Yesterday";
	} else {
		return date.toLocaleDateString('default', { month: 'short', day: 'numeric' })
	}
}

function RecentExpenses({data, loading}) {


  return (
    <div className='bg-surface-raised p-4 border border-border rounded-md flex flex-col'>
			<div className='flex justify-between items-center mb-5'>
				<h1 className='text-2xl'>Recent expenses</h1>
				<div className='flex flex-nowrap'>
					<Link to="/expenses" className='text-primary flex gap-2'>View all <ArrowRight /></Link>
				</div>
			</div>
			<div className='flex-1 min-h-0 overflow-y-auto max-h-55 pr-2'>
        {loading ?  
        <>
          {Array.from({length: 3}, (_, i) => (
            <div key={i}>
              <div className={`flex justify-between bg-surface-raised-2 items-center py-2 px-3 rounded-md ${i == 0 ? null : "mt-2"}`}>
                <div>
                  <Skeleton className='h-5 w-32 mb-2 mt-1'/>
                  <Skeleton className="h-3 w-24 my-1"/>
                </div>
                <div>
                  <Skeleton className="h-5 w-16"/>
                </div>
              </div>
            </div>
          ))}
        </>
        : 
        <> 
          {data.map((item, index) => (
            <div key={index}>
              <div className={`flex justify-between bg-surface-raised-2 items-center py-2 px-3 rounded-md ${index == 0 ? null : "mt-2"}`}>
                <div>
                  <h2 className='text-xl'>{item.merchant}</h2>
                  <div className=''>
                    <p className='text-text-muted'>{item.category ? item.category : "Receipt"} · {getDayString(item)}</p>
                  </div>
                </div>
                <div>
                  <p className='text-lg'>-${item.total}</p>
                </div>
              </div>
            </div>
          ))}
        </>}
			</div>
    </div>
  )
}

export default RecentExpenses