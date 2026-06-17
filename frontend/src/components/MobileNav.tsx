
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Warehouse, Receipt, History, BarChart3 } from 'lucide-react'

const MobileNav = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/billing', label: 'Billing', icon: Receipt },
    { path: '/sales', label: 'Sales', icon: History },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-2xl bg-black/40 border-t border-white/30 md:hidden z-50 pb-safe">
      <div className="flex justify-around items-center py-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 ${
                isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`
            }
          >
            <item.icon size={22} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
