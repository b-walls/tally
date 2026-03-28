import React, {useMemo} from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function RecentExpenses({data, loading}) {
	function extractRecent(data) {
		const maxIndex = Math.min(data.length, 5)
		return data.slice(0, maxIndex);
	}

	const items = useMemo(() => {
    if (loading) return [];
    return extractRecent(data);
	}, [data, loading]);
    
  return (
    <div className='bg-surface-raised p-4 border border-border rounded-md flex-1'>
			<div className='flex justify-between items-center'>
				<h1 className='text-xl'>Recent expenses</h1>
				<div className='flex flex-nowrap'>
					<Link to="/expenses" className='text-blue-400 flex gap-2'>View all <ArrowRight /></Link>
				</div>
			</div>
      {items.map((item, index) => (
				<div key={index}>
					<div>
						{item.merchant}
					</div>
					<hr className='text-border'/>
				</div>
			))}
    </div>
  )
}

export default RecentExpenses