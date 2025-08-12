import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNewspaper,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Hydration',
  },
  {
    component: CNavItem,
    name: 'Add Water',
    to: '/hydration/water',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Plastic Usage',
    to: '/hydration/plastics',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Media',
  },
  {
    component: CNavGroup,
    name: 'News',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Plastic Pollution',
        to: 'https://www.nationalgeographic.com/environment/article/plastic-pollution',
      },
      {
        component: CNavItem,
        name: 'Pollution in the Ocean',
        to: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-pollution',
      },
      {
        component: CNavItem,
        name: 'Oil Spills',
        to: 'https://www.noaa.gov/education/resource-collections/ocean-coasts/oil-spills',
      },
      {
        component: CNavItem,
        name: 'Water Scarcity',
        to: 'https://www.unwater.org/water-facts/water-scarcity',
      },
    ],
  },
]

export default _nav
