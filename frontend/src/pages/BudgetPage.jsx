import { getRemaining } from "@/api/budget";
import { useEffect, useState } from "react";

import CategoryIcon from "@/components/CategoryIcon";
import MonthTag from "@/components/MonthTag";
import WeekTag from "@/components/WeekTag";

const headerStyle = "text-start py-2 uppercase text-text-muted text-sm font-semibold"

export default function BudgetPage() {
  const [budgets, setBudgets] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetData = await getRemaining();

        setBudgets(budgetData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [])
  
  if (loading) {
    return <div>loading...</div>
  }

  return (  
  <div className="flex-1 bg-surface h-full p-5 md:p-10 flex flex-col">
    <div>
      <h1 className="text-2xl">Budget</h1>
      <p className="text-text-muted">{budgets.filter((budget) => budget.limit > 0).length} categories budgeted · {budgets.filter((budget) => budget.limit <= 0).length} unbudgeted · May 2026</p>  
    </div>
    <div className="border border-border bg-surface-raised rounded-lg overflow-clip shadow-md">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-surface border-b border-border shadow-lg">
            <th className={headerStyle + " pl-4"}>Category</th>
            <th className={headerStyle}>Limit</th>
            <th className={headerStyle}>Period</th>
            <th className={headerStyle}>Used</th>
          </tr>
        </thead>

        <tbody>
          {budgets.map((budget, index) => 
            budget.limit > 0 ? (
              <tr className={`border-t-border even:bg-surface-raised-2/60 ${index == 0 ? "" : 'border-t border-t-border'}`} key={budget.id}>
                <td className="px-4">
                  <div className="flex items-center py-2 gap-3">
                    <CategoryIcon category={budget.category} border={true} size={36}/>
                    <p className="text-lg">{budget.category.name}</p>
                  </div>
                </td>
                <td className="pr-4">
                  <p className="text-lg">{`$${budget.limit}`}</p>
                </td>
                <td>{budget.period == "monthly " ? <MonthTag border={true}/> : <WeekTag border={true}/>}</td>
                <td>{budget.remaining / budget.limit}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  </div>
  )
}
