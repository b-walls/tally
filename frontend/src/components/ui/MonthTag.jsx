function MonthTag({border=false}) {
  return (
    <span className={`bg-accent-muted rounded-lg text-accent px-2 max-h-6 ${border ? "border border-accent py-1" : ""}`}>mo</span>
  )
}

export default MonthTag
