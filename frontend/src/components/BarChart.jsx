import React from 'react'

function BarChart() {
  const data = [
    {day: "S", value: 25}, 
    {day: "M", value: 35}, 
    {day: "T", value: 16}, 
    {day: "W", value: 53}, 
    {day: "T", value: 29}, 
    {day: "F", value: 32}, 
    {day: "S", value: 0}
  ]

  const max = data.reduce((max, curr) => {
    if (curr.value > max) {
      max = curr.value;
    }
    return max
  }, -Infinity);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0)
  startOfWeek.setMinutes(0)
  startOfWeek.setSeconds(0)

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23)
  endOfWeek.setMinutes(59)
  endOfWeek.setSeconds(59)

  console.log(startOfWeek)
  console.log(endOfWeek)
  // TODO
  // get beginning of week
  // get end of week

  // get beginning of month
  // get end of month

  return (
    <div className='flex flex-col gap-2 border bg-surface-raised border-border p-5 rounded-lg'>
      <div>
        <h1 className='text-xl'>Daily spending</h1>
        <p className='text-text-muted text-shadow-sm text-shadow-surface'>
          {startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' }) } - {endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' }) }
        </p>
      </div>
      <div className="flex h-30 gap-1 pb-2 px-1 md:px-4">
      {data.map((item, index) => (
        <div className='flex-1 text-center' key={index}> 
          <div className='h-full flex flex-col justify-end'>
              { item.value <= 0 ? 
              <div 
                className='h-full border-2 border-dashed rounded-lg border-border shadow-md'>
              </div>
              :
              (index == dayOfWeek ? 
                <div 
                  className='bg-primary rounded-lg shadow-md' 
                  style={{height: ((item.value / max) * 100) + "%"}}>
                </div>
                : 
                <div 
                  className='bg-surface-raised-2 rounded-lg shadow-md' 
                  style={{height: ((item.value / max) * 100) + "%"}}>
                </div>
              )}
          </div>
          {index == dayOfWeek ? 
          <p className='text-primary'>{item.day}</p>
          :
          <p>{item.day}</p>
          }
        </div>
      ))}
      </div>
    </div>
  )
}

export default BarChart