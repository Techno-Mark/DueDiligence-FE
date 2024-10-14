// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/dashboard',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Set',
    href: '/about',
    icon: 'tabler-info-circle'
  }
]

export default horizontalMenuData
