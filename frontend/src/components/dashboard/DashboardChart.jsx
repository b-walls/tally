"use client"
import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { sameDay } from "@/utils/date"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday", "Saturday"]

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

function transform(week, month) {
  const weekTotals = extractDailyTotals(week).map((item, i) => ({day: weekdays[i], total: item.total}));
  const monthTotals = extractDailyTotals(month).map(item => ({
    date: item.date,
    dateStr: item.date.toISOString(),
    total: item.total
  }));
  return {week: weekTotals, month: monthTotals};
}

const chartConfig = {
  desktop: {
    label: "Spending",
    color: "#000",
  },
}

const [rangeStart, rangeEnd] = ["Apr 2nd", "Apr 20th"]

export function DashboardChart( {weekData, monthData, loading} ) {
  const [view, setView] = useState('week');

  const handleSwitchType = () => {
    setView(prev => prev === 'week' ? 'month' : 'week');
  }

  const chartData = useMemo(() => {
    // wait for both of them
    if (!weekData || !monthData) {
      return null;
    }
    console.log("MADDE ITT!!")
    return transform(weekData, monthData);
  }, [weekData, monthData])

  if (loading) {
    return <h1>loading...</h1>
  }

  return (
    <div className='flex flex-col flex-1 border bg-surface-raised border-border p-4 rounded-lg justify-between'>
      <div className="flex justify-between">
        <div>
          <h1 className='text-2xl'>Daily spending</h1>
          {view == "week" ? 
          <>
            <p className="text-text-muted mt-1">
              {weekData.startDate.toLocaleDateString('default', { month: 'short', day: 'numeric'})} - {weekData.endDate.toLocaleDateString('default', { month: 'short', day: 'numeric'})}
            </p>
          </>          
          :
          <>
            <p className="text-text-muted mt-1">
              {monthData.startDate.toLocaleDateString('default', { month: 'short', day: 'numeric'})} - {monthData.endDate.toLocaleDateString('default', { month: 'short', day: 'numeric'})}
            </p>
          </>}
        </div>
    
        <div
          className="w-25 h-10 rounded-[9999px] bg-surface border border-border p-0.75 flex cursor-pointer hover:bg-surface-raised"
          onClick={handleSwitchType}
        >
          <div className={`relative w-full flex transition-all duration-300`}>
            <div className={`h-full w-[50%] rounded-[9999px] flex justify-center items-center transition-transform duration-300 border border-border ${
              view === 'month' ? 'translate-x-full bg-accent-muted text-accent' : 'translate-x-0 bg-accent-2-muted text-accent-2'
            }`}>
              {view === 'week' ? 'wk' : 'mo'}
            </div>
          </div>
        </div>
      </div>
      <ChartContainer config={chartConfig}>
        {view == 'week' ?
        <BarChart
          accessibilityLayer
          data={chartData.week}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "var(--color-text-muted)"}}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Bar dataKey="total" fill="var(--color-primary)" radius={8}>
            <LabelList
              position="top"
              offset={12}
              className="fill-text-muted"
              fontSize={12}
              formatter={(value) => value ? `$${value.toFixed(2)}` : ""}
            />
          </Bar>
        </BarChart>
        : 
        <BarChart
          accessibilityLayer
          data={chartData.month ? chartData.month : []}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="dateStr"
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "var(--color-text-muted)"}}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          />
          <ChartTooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              defaultIndex={1}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex flex-1 justify-between leading-none items-center">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-mono font-medium tabular-nums">${value.toFixed(2)}</span>
                    </div>
                  )}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
          <Bar dataKey="total" fill="var(--color-primary)" radius={4}/>
        </BarChart>}
      </ChartContainer>
    </div>
  )
}

export default DashboardChart