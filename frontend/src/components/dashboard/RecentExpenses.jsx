import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import CategoryIcon from '../CategoryIcon'
import { getDayString } from '../../utils/date'

function RecentExpenses({data, loading}) {


  return (
    <div className='bg-surface-raised p-4 border border-border rounded-md flex flex-col flex-1 md:min-h-0'>
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
                <div className='flex items-center gap-3'>
                  <Skeleton className="h-10 w-[42px]" style={{animationDelay: `-${i * 0.4}s`}}/>
                  <div>
                    <Skeleton className='h-5 w-32 mb-2 mt-1' style={{animationDelay: `-${i * 0.4 + 0.1}s`}}/>
                    <Skeleton className="h-3 w-24 my-1" style={{animationDelay: `-${i * 0.4 + 0.2}s`}}/>
                  </div>
                </div>
                <div className='flex flex-col items-end'>
                  <Skeleton className="h-3 w-16 my-1" style={{animationDelay: `-${i * 0.4 + 0.3}s`}}/>
                  <Skeleton className="h-3 w-10 my-1" style={{animationDelay: `-${i * 0.4 + 0.4}s`}}/>
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
                <div className='flex items-center gap-3'>
                  <CategoryIcon category={item.category}/>
                  <div>
                    <h2 className='text-xl'>{item.merchant}</h2>
                    <div className='flex items-center gap-px ml-0.5'>
                      <span className='inline-block rounded-full w-2 h-2 shrink-0 mr-1' style={{backgroundColor: item.category.color}}/>
                      <p className='text-text-muted'>{item.category.name ? item.category.name : "Receipt"}</p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col items-end'>
                  <p className='text-lg text-danger'>-${item.total}</p>
                   <p className='text-text-muted'>{getDayString(item)}</p>
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