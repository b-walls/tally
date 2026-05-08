import { getRemaining } from "@/api/budget";
import { useEffect, useState } from "react";

import CategoryIcon from '@/components/ui/CategoryIcon'
import MonthTag from '@/components/ui/MonthTag'
import WeekTag from '@/components/ui/WeekTag'
import Bar from '@/components/ui/Bar'

import { DesktopSheet } from "@/components/budget/DesktopSheet";
import { Pencil } from "lucide-react";

const headerStyle = "py-2 font-semibold"

export default function BudgetPage() {
  const [budgetedData, setBudgetedData] = useState([]);
  const [unbudgetedData, setUnbudgetedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  const fetchData = async () => {
      try {
        const data = await getRemaining();
        data.sort((a, b) => a.category.name.localeCompare(b.category.name))
        const budgetedData = [];
        const unbudgetedData = [];
        data.forEach(budget => {
          if (budget.limit > 0) {
            budgetedData.push(budget)
          } else {
            unbudgetedData.push(budget)
          }
        });
        setBudgetedData(budgetedData);
        setUnbudgetedData(unbudgetedData)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchData();
  }, [])

  if (loading) {
    return <div>loading...</div>
  }

  return (  
  <div className="flex-1 bg-surface h-full px-2 py-5 md:p-10 flex flex-col overflow-x-auto">
    <div className="mb-4">
      <h1 className="text-2xl">Budget</h1>
      <p className="text-text-muted flex flex-wrap">
        <span className="text-nowrap">{budgetedData.length} categories budgeted ·&nbsp;</span>
        <span className="text-nowrap">{unbudgetedData.length} unbudgeted</span>
      </p>  
    </div>
    <div className="border border-border bg-surface-raised rounded-lg overflow-clip shadow-md">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-surface border-b border-border shadow-lg">
            <th className={headerStyle + " pl-4 hidden sm:block text-start"}>Category</th>
            <th className={headerStyle + " pl-4 sm:hidden text-start"}>Cat</th>
            <th className={headerStyle + " text-start"}>Limit</th>
            <th className={headerStyle + " text-start"}>Period</th>
            <th className={headerStyle + " text-center"}>Used</th>
          </tr>
        </thead>

        <tbody>
          {budgetedData.map((budget, index) => 
            budget.limit > 0 ? (
              <tr 
                className={`border-t-border even:bg-surface-raised-2/60 ${index == 0 ? "" : 'border-t border-t-border'}`}
                key={budget.id}
              >
                <td className="px-4">
                  <div className="flex items-center py-2 gap-3">
                    <CategoryIcon category={budget.category} border={true} size={36}/>
                    <p className="hidden sm:block">{budget.category.name}</p>
                  </div>
                </td>
                <td className="pr-2 sm:pr-4">
                  <p className='text-text-muted'>{`$${budget.limit}`}</p>
                </td>
                <td>
                  {budget.period === "monthly" ? 
                    <MonthTag border={true} rounded={"rounded-full"}>
                      <span className="hidden sm:inline">monthly</span>
                      <span className="inline sm:hidden">mo</span>
                    </MonthTag>
                    :
                    <WeekTag border={true} rounded={"rounded-full"}>
                      <span className="hidden sm:inline">weekly</span>
                      <span className="inline sm:hidden">wk</span>
                    </WeekTag>
                  }
                  </td>
                <td className="w-[40%] pr-4">
                  <div className="flex justify-between gap-2 items-center">
                    <div className="w-full flex flex-col pr-2 sm:pr-4 gap-0 pt-5">
                      <Bar percentFilled={Math.min(100, (budget.spent / budget.limit) * 100) + "%"} color={"bg-primary"} dangerEnabled={true} margin={false}/>
                      <span className=" text-sm mt-0.5 mb-2">${budget.spent} / ${budget.limit}</span>
                    </div>
                    <DesktopSheet budget={budget} onSave={fetchData}>
                      <Pencil size={16}/> Edit
                    </DesktopSheet>
                  </div>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
    { unbudgetedData.length > 0 ?
    <div className="border-dashed border border-border w-full mt-4 rounded-md ">
      <div className="p-4">
        <h1>Needs setup</h1>
        <p className="text-text-muted">Categories without a limit set</p>
      </div>
      <table className="w-full table-fixed">
        <tbody>
        {unbudgetedData.map((budget) => (
          <tr className="border-dashed border-t border-t-border bg-surface-raised odd:bg-surface-raised-2/60" key={budget.id}>
            <td>
              <div className="flex gap-2 items-center py-3 px-4 overflow-hidden"><CategoryIcon category={budget.category} border={true} size={36}/>
                <p className="truncate min-w-0">{budget.category.name}</p>
              </div>
            </td>
            <td className="py-3 px-4 text-right">
              <DesktopSheet budget={budget} onSave={fetchData}>
                <Pencil size={16}/> Edit
              </DesktopSheet>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div> : null}
  </div>
  )
}
