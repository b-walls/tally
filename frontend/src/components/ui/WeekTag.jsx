function WeekTag({children, border=false, rounded="rounded-lg"}) {
  return (
    <span className={`bg-accent-2-muted text-accent-2 px-2 max-h-6 ${border ? "border border-accent-2 py-1" : ""} ${rounded}`}>{children}</span>
  )
}

export default WeekTag
