import React from 'react'
import { Tag } from 'lucide-react'
import { iconMap } from '@/utils/categoryIcons'

function CategoryIcon({category}) {
const Icon = iconMap[category.icon] ?? Tag
  return (
    <Icon className="p-2 rounded-md" size={42} style={{color: category.color, backgroundColor: category.color + "26"}}/>
  )
}

export default CategoryIcon