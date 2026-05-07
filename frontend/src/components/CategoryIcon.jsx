import React from 'react'
import { Tag } from 'lucide-react'
import { iconMap } from '@/utils/categoryIcons'

function CategoryIcon({category, border=false, size=42}) {
const Icon = iconMap[category.icon] ?? Tag
  return (
    <Icon className="p-2 rounded-md" size={size} style={{color: category.color, backgroundColor: category.color + "26", border: border ? `1px solid ${category.color}` : null}}/>
  )
}

export default CategoryIcon