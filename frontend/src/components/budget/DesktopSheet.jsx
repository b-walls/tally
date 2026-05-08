import { useState } from "react"
import { updateBudget } from "@/api/budget"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { iconMap } from "@/utils/categoryIcons"

const inputStyle = "bg-surface-raised rounded-md border border-border p-2 w-full"
const labelStyle = "text-sm text-text-muted"

const PRESET_COLORS = [
  // reds & pinks
  "#f87171", "#fb7185",
  // oranges & yellows
  "#fb923c", "#fbbf24", "#facc15",
  // greens
  "#4ade80", "#a3e635", "#34d399", "#00d4aa",
  // blues & cyans
  "#22d3ee", "#38bdf8", "#60a5fa",
  // purples & greys
  "#a78bfa",  "#e879f9", "#f472b6", "#8896b3"
]

export function DesktopSheet({children, budget, onSave}) {
  const [name, setName] = useState(budget.category.name)
  const [icon, setIcon] = useState(budget.category.icon)
  const [color, setColor] = useState(budget.category.color)
  const [limit, setLimit] = useState(budget.limit)
  const [period, setPeriod] = useState(budget.period)
  const [disabled, setDisabled] = useState(Number(budget.limit) <= 0)
  const [open, setOpen] = useState(false)

	const handleDisable = () => {
		if (!disabled) {
			setDisabled(!disabled);
			setLimit(0);
		} else {
			setDisabled(!disabled);
		}
	}
	
	const handleLimitChange = (e) => {
		const val = e.target.value;
		setDisabled(!(val > 0));
		setLimit(val);
	}

  const handleSave = async () => {
    const effectiveLimit = disabled ? 0 : limit
    try {
      await updateBudget(budget.id, name, icon, color, effectiveLimit, period)
			onSave()
      setOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="bg-transparent cursor-pointer shadow-lg">{children}</Button>
      </SheetTrigger>
      <SheetContent className="bg-background border-l border-l-border overflow-y-auto w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Edit {budget.category.name}</SheetTitle>
          <SheetDescription>
            Make changes to your {budget.category.name} budget. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-2">
            <label htmlFor="category-name" className={labelStyle}>Category Name</label>
            <input id="category-name" className={inputStyle} type="text"
                   value={name} onChange={e => setName(e.target.value)}/>
          </div>
          <div className="grid gap-2">
            <label htmlFor="category-icon" className={labelStyle}>Icon</label>
							<div className="flex flex-wrap flex-1 gap-2 items-center">
								{Object.entries(iconMap).map(([key, Icon]) => (
									<Icon key={key} 
												className={`${key == icon ? "border border-border" : ""} p-1 rounded-md cursor-pointer`}
												size={32}
												onClick={() => setIcon(key)}
									/>
								))}
							</div>
          </div>
          <div className="grid gap-2">
            <label className={labelStyle}>Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${color === c ? "border-white scale-110" : "border-transparent"}`}
                  style={{backgroundColor: c}}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="budget-limit" className={labelStyle}>Limit ($)</label>
            <input id="budget-limit" className={inputStyle} type="number" min="0" step="0.01"
                   value={limit} onChange={handleLimitChange}/>
          </div>
          <div className="grid gap-2">
            <label htmlFor="budget-period" className={labelStyle}>Period</label>
            <div className="flex w-full border border-border rounded-md">
							<button className={`border-r border-r-border flex-1 py-4 rounded-l-md cursor-pointer
								${period == "weekly" ? "bg-primary text-background" : ""}`}
								onClick={() => setPeriod("weekly")}
							>
								Weekly
							</button>
							<button className={`flex-1 rounded-r-md cursor-pointer
								${period == "monthly" ? "bg-primary text-background" : ""}`}
								onClick={() => setPeriod("monthly")}
							>
								Monthly
							</button>
						</div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="budget-enabled" className={labelStyle}>Enabled</label>
            <Switch id="budget-enabled" checked={!disabled} onCheckedChange={handleDisable} className={"cursor-pointer"}/>
          </div>
        </div>
        <SheetFooter>
          <Button type="button" onClick={handleSave} className="cursor-pointer text-background">Save changes</Button>
          <SheetClose asChild className="cursor-pointer">
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
