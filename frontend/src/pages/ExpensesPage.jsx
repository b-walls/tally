import { Link, createSearchParams } from "react-router-dom"
import { Scan, Plus, SparkleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategories } from "../api/category";
import { Search } from "lucide-react";
import { getTodayRange, getWeekRange, getMonthRange, getLastMonthRange, getLast3MonthRange, getThisYearRange } from "../utils/date";
import { getExpenseRange } from "../api/expense";

const sortOptions = [
  {groupName: "By date", options: ["Newest first", "Oldest first"]},
  {groupName: "By amount", options: ["Highest first", "Lowest first"]}
]

const dateRangeOptions = [
  "Today", "This week", "This month", "Last month", "Last 3 months", "This year"
]

const rangeToDates = {
  "Today": getTodayRange, 
  "This week": getWeekRange, 
  "This month": getMonthRange, 
  "Last month": getLastMonthRange, 
  "Last 3 months": getLast3MonthRange, 
  "This year": getThisYearRange, 
}

const sortToString = {
  "Newest first": "-date", 
  "Oldest first": "date",
  "Highest first": "-total",
  "Lowest first": "total",

}


export default function ReceiptsPage() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({range: "This month", category: "All", sort: "Newest first", search: ""});
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState({expenses: true, categories: true});

  useEffect(() => {
    const fetchExpenses = async () => {
      const [start, end] = rangeToDates[filters.range]();
      const sortStr = sortToString[filters.sort];
      
      try {
        setLoading((p) => ({...p, expenses: true}));
        let data = await getExpenseRange(start, end, sortStr);

        if (filters.category !== "All") {
          data = data.filter((item) => {
            if (item.category) {
              return item.category === filters.category;
            } else {
              return "Receipt" === filters.category;
            }
          })
        }
        setExpenses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((p) => ({...p, expenses: false}));
      }
    }

    fetchExpenses();
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getCategories();
        data = [{id: null, name: "Receipt"}, ...data]
        setCategories(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading((p) => ({...p, categories: false}));
      }
    }

    fetchData();
  }, [])

  return (
    <div className="flex-1 bg-surface h-full p-5 md:p-10">
      <div className="flex flex-wrap justify-between items-center my-3">
        <div>
          <h1 className="text-2xl">Expenses</h1>
          {loading.expenses ? <p className="text-text-muted">loading...</p> : <p className="text-text-muted">{expenses.length} transactions {filters.range.toLowerCase()}</p>}
        </div>
        <div className="md:flex gap-2 hidden ">
          <Link to="/expenses/scan" className="border border-border bg-surface-raised rounded-lg p-3 flex gap-2 items-center transition-all duration-300 hover:bg-surface-raised-2"> <Scan/> Scan receipt</Link>
          <Link to="/expenses/log" className="border border-border bg-primary text-background rounded-lg p-3 flex gap-2 items-center transition-all duration-300 hover:bg-primary/80"> <Plus/> Log expense</Link>
        </div>
      </div>
      <div className="flex flex-wrap flex-col md:flex-row gap-3">
        <div className="bg-surface-raised border border-border p-3 rounded-md flex-1 flex gap-3">
          <Search className="text-text-muted"/><input className="flex-1" type="text" placeholder="Search expenses..."/>
        </div>
        <div className="flex gap-3 flex-1 flex-wrap md:flex-nowrap">
          <select name="category" className="bg-surface-raised border border-border p-3 rounded-t-md rounded-b-md focus:rounded-b-none flex-1"
            value={filters.category} onChange={(e) => {setFilters((p) => ({...p, category: e.target.value}))}}>
            <option value="All" className="text-text-muted">All categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name} className="text-text-muted">
                {category.name}
              </option>
            ))}
          </select>
          <select name="category" className="bg-surface-raised border border-border p-3 rounded-t-md rounded-b-md focus:rounded-b-none flex-1"
            value={filters.sort} onChange={(e) => {setFilters((p) => ({...p, sort: e.target.value}))}}>
            {sortOptions.map((group, index) => (
              <optgroup key={index} label={group.groupName}>
                {group.options.map((option, index) => (
                  <option key={index} value={option} className="text-text-muted">
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap py-3 gap-2">
        {dateRangeOptions.map((range, index) => (
          <span key={index}
            className={`py-1 px-3 rounded-4xl border border-border cursor-pointer transition-all duration-350 ${range === filters.range ? "text-background bg-primary" : "bg-surface hover:bg-primary/30 hover:text-primary"}`}
            onClick={() => {setFilters((p) => ({...p, range: range}))}}>
            {range}
          </span>
        ))}
      </div>
      <div>
        {loading.expenses ? (
          <p>loading...</p>
        ) : (
          expenses.map((expense, index) => (
            <div key={index} className="bg-surface-raised-2">{expense.merchant} - ${expense.total.toFixed(2)}</div>
          ))
        )}
      </div>
    </div>
  )
}
