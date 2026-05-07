import React from 'react'

function Bar({percentFilled, color, dangerThreshold="80%", dangerColor="bg-red-500", dangerEnabled=false, margin=true}) {
  return (
    <div className={`flex flex-1 min-h-2 max-h-2 bg-surface-raised-2 ${margin ? "my-2" : ""} rounded-md overflow-clip`}>
      { +percentFilled.substring(0, percentFilled.length - 1) > + dangerThreshold.substring(0, dangerThreshold.length - 1) && dangerEnabled ?
        <div className={`${dangerColor} rounded-md`} style={{width: percentFilled}}/>
      : 
        <div className={`${color} rounded-md`} style={{width: percentFilled}}/>
      }
    </div>
  )
}

export default Bar