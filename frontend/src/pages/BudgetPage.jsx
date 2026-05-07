import { getRemaining } from "@/api/budget";
import { useEffect, useState } from "react";
import BudgetTable from "@/components/budget/BudgetTable";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState();
  const [loading, setLoading] = useState(true);
  const today = new Date();

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
  
  const refetchData = async () => {
    setLoading(true);
    try {
      const budgetData = await getRemaining();
      setBudgets(budgetData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (  
  <div className="flex-1 bg-surface h-full px-2 py-5 md:p-10 flex flex-col">
    <div className="mb-4">
      <h1 className="text-2xl">Budget</h1>
      <p className="text-text-muted flex flex-wrap">
        <span className="text-nowrap">{budgets.filter((budget) => budget.limit > 0).length} categories budgeted ·&nbsp;</span>
        <span className="text-nowrap">{budgets.filter((budget) => budget.limit <= 0).length} unbudgeted</span>
      </p>  
    </div>
    <BudgetTable loading={loading} budgets={budgets} onSave={refetchData}/>
  </div>
  )
}
