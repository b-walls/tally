import { Pencil } from 'lucide-react'

import CategoryIcon from '../ui/CategoryIcon'
import MonthTag from '../ui/MonthTag'
import WeekTag from '../ui/WeekTag'
import Bar from '../ui/Bar'
import { DesktopSheet } from './DesktopSheet'

const headerStyle = "py-2 uppercase text-text-muted text-sm font-semibold"

function BudgetTable({loading, budgets, onSave}) {
  if (loading) {
		return <div>loading...</div>
	}

  return (
		<>
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
          {budgets.map((budget, index) => 
            budget.limit > 0 ? (
              <tr 
                className={`border-t-border even:bg-surface-raised-2/60 ${index == 0 ? "" : 'border-t border-t-border'}`}
                key={budget.id}
              >
                <td className="px-4">
                  <div className="flex items-center py-2 gap-3">
                    <CategoryIcon category={budget.category} border={true} size={36}/>
                    <p className="text-lg hidden sm:block">{budget.category.name}</p>
                  </div>
                </td>
                <td className="pr-2 sm:pr-4">
                  <p className="text-lg">{`$${budget.limit}`}</p>
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
                    <DesktopSheet budget={budget} onSave={onSave}>
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
		</>
  )
}

export default BudgetTable