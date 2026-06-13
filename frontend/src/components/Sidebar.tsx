
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Warehouse, Receipt, History, BarChart3 } from 'lucide-react'

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/inventory', label: 'Inventory', icon: Warehouse },
    { path: '/billing', label: 'Billing', icon: Receipt },
    { path: '/sales', label: 'Sales', icon: History },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <div className="w-64 backdrop-blur-2xl bg-black/40 border-r border-white/30 hidden md:block shadow-2xl">
      <div className="p-6 border-b border-white/30">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">Clothing Shop</h1>
      </div>
      <nav className="p-4 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-white/30 text-white shadow-xl shadow-purple-500/30 backdrop-blur-md border border-white/40'
                  : 'text-white/90 hover:bg-white/20 hover:text-white border border-transparent hover:border-white/30'
              }`
            }
          >
            <item.icon size={22} />
            <span className="font-semibold text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
