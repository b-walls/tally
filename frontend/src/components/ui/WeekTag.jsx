function WeekTag({border=false}) {
  return (
    <span className={`bg-accent-2-muted rounded-lg text-accent-2 px-2 max-h-6 ${border ? "border border-accent-2 py-1" : ""}`}>wkly</span>
  )
}

export default WeekTag
