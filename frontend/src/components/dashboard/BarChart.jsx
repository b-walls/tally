import React, { useMemo } from 'react'
import { sameDay } from '../../utils/date'

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const COLORS = {primary: "#a78bfa", surfaceRaised2: "#2e2e2e", border: "#333333"}

function getWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return [startOfWeek, endOfWeek, dayOfWeek];
}


function extractDailyTotals(data) {
  const dailyTotals = []
  let ptr = 0;

  const currDate = new Date(data.startDate);
  const stopDate = new Date(data.endDate);

  // [year, month, day]
  let dateStrFields = [];

  while (currDate <= stopDate) {
    const copiedCurr = new Date(currDate);

    // get next dateStrFields if exists
    if (ptr < data.data.length) {
      dateStrFields = data.data[ptr].date.split('-').map(Number)
    }

    // day with no entry
    if (ptr >= data.data.length || copiedCurr < new Date(dateStrFields[0], dateStrFields[1] - 1, dateStrFields[2])) {
      dailyTotals.push({date: copiedCurr, total: 0})

    // day with entry add up all entries on that day
    } else {
      let total = 0;

      while (ptr < data.data.length && sameDay(copiedCurr, new Date(dateStrFields[0], dateStrFields[1] - 1, dateStrFields[2]))) {
        total += data.data[ptr].total;
        ptr += 1

        // get next dateStrFields
        if (ptr < data.data.length) {
          dateStrFields = data.data[ptr].date.split('-').map(Number)
        }
      }
      dailyTotals.push({date: copiedCurr, total: total})
    }

    // increment
    currDate.setDate(currDate.getDate() + 1);
  }
  return dailyTotals;
}

function Bar( {item, max, index, dayOfWeek} ) {
  const inFuture = index > dayOfWeek;

  let height = "100%";
  let color = "";
  let border = "1px dashed " + COLORS.border;
  let shadow = "";

  if (!inFuture) {
    height = ((item.total / max) * 100) == 0 ? "5%" : ((item.total / max) * 100) + "%";
    color = index == dayOfWeek ? COLORS.primary : COLORS.surfaceRaised2;
    border = "1px solid " + COLORS.border;
    shadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
  }

  return (
    <div
      className='rounded-xs'
      style={{height: height, backgroundColor: color, border: border, boxShadow: shadow}}>
    </div>
  )
}

function BarChart( {data, loading} ) {
  const [startOfWeek, endOfWeek, dayOfWeek] = getWeekRange();

  const dailyTotals = useMemo(() => {
    if (loading) return [];
    return extractDailyTotals(data);
  }, [data, loading]);

  const max = useMemo(() => {
    if (!dailyTotals.length) return 0;
    return dailyTotals.reduce((m, curr) => curr.total > m ? curr.total : m, 0);
  }, [dailyTotals]);

  return (
    <div className='flex flex-col flex-1 border bg-surface-raised border-border p-4 rounded-lg justify-between'>
      <div>
        <h1 className='text-2xl'>Daily spending</h1>
        <p className='text-text-muted text-shadow-sm text-shadow-surface'>
          {startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' }) } - {endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' }) }
        </p>
      </div>
      { loading ?
      <div className="flex h-30 gap-1 pb-2 px-1 md:px-4"/>
      :
      <div className="flex flex-1 min-h-30 pt-2 gap-1 pb-5 px-1 md:px-4">
      {dailyTotals.map((item, index) => (
        <div className='flex-1 text-center' key={index}>
          <div className='h-full flex flex-col justify-end'>
              <Bar item={item} max={max} index={index} dayOfWeek={dayOfWeek} />
          </div>
          {/* colors the bar label */}
          {index == dayOfWeek ?
            <p className='text-primary'>{DAY_LETTERS[index]}</p>
            :
            <p className='text-text-muted'>{DAY_LETTERS[index]}</p>
          }
        </div>
      ))}
      </div>
      }
    </div>
  )
}

export default BarChart
