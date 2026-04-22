import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import { getCategories } from '@/api/category';
import { createExpense } from '@/api/expense';

import { Tag } from 'lucide-react'
import { iconMap } from '@/utils/categoryIcons'

function formatDate(date) {
  const day = date.getDate();
  const ordinal = (d) => {
    if (d > 3 && d < 21) return "th";
    return ["th","st","nd","rd"][d % 10] ?? "th";
  };
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${day}${ordinal(day)}, ${year}`;
}

function validateForm(fields) {
  return fields.total !== "" && fields.category_id !== "" && fields.merchant !== "";
}

function LogPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState({
    merchant: '',
    category_id: '',
    total: '',
    note: '',
  })
  const [date, setDate] = useState(new Date());
  const [hoveredId, setHoveredId] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let data = await getCategories();
        setCategories(data.reverse());
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []) 

  const submitExpense = async (e) => {
    e.preventDefault();
    try {
      await createExpense(fields.merchant, fields.category_id, date, parseFloat(fields.total), fields.note);
      navigate('/expenses');
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'>Loading...</div>
  }

  return (
    <div className='min-w-full min-h-full flex justify-center p-10'>
      <div className='w-full flex flex-col items-center justify-center'>
        <form onSubmit={submitExpense} className='max-w-full flex-1 flex flex-col gap-6 pb-10'>
          <div className='w-full flex flex-col justify-start pb-10'>
            <h1 className='text-4xl'>Log an expense</h1>
            <p className='text-text-muted uppercase py-2'>Track where your money goes</p>
          </div>
          <div className='flex gap-5 flex-wrap'>
            <div className='flex flex-col flex-1 min-w-48'>
              <label htmlFor="total" className='uppercase text-text-muted mb-1'>Amount</label>
              <div className='flex items-center bg-surface-raised border border-border rounded-md'>
                <span className='text-primary py-3 pl-5 pr-2 text-3xl font-bold' aria-hidden="true">$</span>
                <input
                  id="total"
                  type="text"
                  inputMode="decimal"
                  aria-label="Amount in dollars"
                  placeholder='0.00'
                  value={fields.total}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(val)) setFields({ ...fields, total: val });
                  }}
                  className='text-4xl py-3 flex-1 bg-transparent placeholder:text-text-muted
                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="date" className='text-text-muted uppercase mb-1'>Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-[212px] h-16 text-lg justify-between text-left font-normal data-[empty=true]:text-muted-foreground bg-surface-raised border-border"
                  >
                    {date ? formatDate(date) : <span>Pick a date</span>}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-surface-raised border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="merchant" className='text-text-muted uppercase mb-1'>Merchant</label>
            <input
              id="merchant"
              type="text"
              autoComplete="organization"
              placeholder="e.g. Whole Foods"
              value={fields.merchant}
              onChange={(e) => setFields({ ...fields, merchant: e.target.value })}
              className='bg-surface-raised border border-border rounded-md text-2xl px-4 py-3 placeholder:text-text-muted'
            />
          </div>
          <div>
          <h2 className='mb-1 text-text-muted uppercase'>Category</h2>
            <div className='flex flex-wrap justify-start gap-4'>
              {categories.map((category, index) => {
                const Icon = iconMap[category.icon] ?? Tag
                const selected = category.id === fields.category_id
                const hovered = hoveredId === category.id

                return (
                  <div
                    key={index}
                    className="border flex flex-col rounded-md p-3 justify-center items-center overflow-x-hidden w-25 sm:w-30 cursor-pointer"
                    style={{
                      color: selected ? category.color : (hovered ? category.color : "#8896b3"),
                      backgroundColor: selected ? category.color + (hovered ? '40' : '26') : (hovered ? category.color + '26' : "#8896b3" + '26'),
                      borderColor: selected ? category.color : hovered ? category.color : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredId(category.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setFields({ ...fields, category_id: category.id })}
                  >
                    <Icon className="p-2 rounded-md" size={42}/>
                    <p>{category.name}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='flex flex-col'>
            <label htmlFor="note" className='text-text-muted uppercase mb-1'>Note <span className='normal-case'>(optional)</span></label>
            <textarea
              id="note"
              rows={3}
              placeholder="Add a note..."
              value={fields.note}
              onChange={(e) => setFields({ ...fields, note: e.target.value })}
              className='bg-surface-raised border border-border rounded-md text-xl px-4 py-3 placeholder:text-text-muted resize-none'
            />
          </div>         
          <button
            type="submit"
            disabled={!validateForm(fields)}
            className='bg-primary text-background rounded-lg px-6 py-3 text-lg font-semibold self-start transition-all duration-300 hover:bg-primary-hover hover:cursor-pointer disabled:bg-surface-raised disabled:cursor-not-allowed'
          >
            {fields.total !== "" ? `Log $${fields.total}  expense` : "Log expense"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LogPage