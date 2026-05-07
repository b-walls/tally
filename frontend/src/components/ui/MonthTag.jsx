function MonthTag({children, border=false, rounded="rounded-lg"}) {
  return (
    <span className={`bg-accent-muted text-accent px-2 max-h-6 ${border ? "border border-accent py-1" : ""} ${rounded}`}>{children}</span>
  )
}

export default MonthTag
