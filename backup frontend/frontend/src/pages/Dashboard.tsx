
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Package, Warehouse, Receipt, AlertTriangle, Plus, ShoppingCart } from 'lucide-react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const navigate = useNavigate()

  const { data: report } = useQuery({
    queryKey: ['dailyReport'],
    queryFn: async () => {
      const res = await api.get('/reports/daily')
      return res.data
    },
  })

  const { data: lowStock } = useQuery({
    queryKey: ['lowStock'],
    queryFn: async () => {
      const res = await api.get('/inventory/low-stock')
      return res.data
    },
  })

  const stats = [
    {
      title: 'Total Products',
      value: report?.total_products || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-700',
      borderColor: 'border-blue-400/50',
    },
    {
      title: 'Total Stock',
      value: report?.total_stock || 0,
      icon: Warehouse,
      color: 'from-green-500 to-green-700',
      borderColor: 'border-green-400/50',
    },
    {
      title: "Today's Sales",
      value: `₹${(report?.total_revenue || 0).toFixed(2)}`,
      isRupee: true,
      color: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-400/50',
    },
    {
      title: "Today's Bills",
      value: report?.total_bills || 0,
      icon: Receipt,
      color: 'from-orange-500 to-orange-700',
      borderColor: 'border-orange-400/50',
    },
    {
      title: 'Low Stock',
      value: report?.low_stock_count || 0,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-700',
      borderColor: 'border-red-400/50',
    },
  ]

  const quickActions = [
    { label: 'Create Bill', icon: ShoppingCart, onClick: () => navigate('/billing'), color: 'from-blue-500 to-purple-600' },
    { label: 'Add Product', icon: Plus, onClick: () => navigate('/products'), color: 'from-pink-500 to-red-600' },
    { label: 'Add Stock', icon: Warehouse, onClick: () => navigate('/inventory'), color: 'from-green-500 to-teal-600' },
    { label: 'View Inventory', icon: Package, onClick: () => navigate('/inventory'), color: 'from-yellow-500 to-orange-600' },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Dashboard</h1>
        <p className="text-white/90 text-lg">Welcome to your SM Garments management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`backdrop-blur-2xl bg-black/30 border-2 ${stat.borderColor} shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-xl`}>
                  {stat.isRupee ? (
                    <span className="text-3xl font-extrabold text-white">₹</span>
                  ) : (
                    <stat.icon size={32} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/90 mb-1">{stat.title}</p>
                  <p className={`font-extrabold text-white break-all ${stat.title === "Today's Sales" ? 'text-xl' : 'text-2xl'}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto py-8 flex-col gap-3 border-2 border-white/40 hover:border-white/60 transition-all duration-300 shadow-xl hover:shadow-purple-500/30 bg-black/30 backdrop-blur-2xl hover:bg-black/40`}
              onClick={action.onClick}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-xl`}>
                <action.icon size={36} className="text-white" />
              </div>
              <span className="text-lg font-semibold text-white">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Low Stock Products */}
      {lowStock && lowStock.length > 0 && (
        <Card className="backdrop-blur-2xl bg-black/30 border-2 border-red-400/50 shadow-2xl">
          <CardHeader className="border-b border-white/20">
            <CardTitle className="flex items-center gap-2 text-white text-xl">
              <AlertTriangle size={28} className="text-red-300" />
              Low Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Product</th>
                    <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Category</th>
                    <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Current Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((product: any) => (
                    <tr key={product.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={`http://localhost:5000${product.image_url}`}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-xl shadow-lg"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
                              <Package size={24} className="text-white/80" />
                            </div>
                          )}
                          <span className="font-bold text-white text-xl">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/90 text-lg">{product.category}</td>
                      <td className="py-4 px-6">
                        <span className="px-5 py-2 bg-gradient-to-r from-red-500/40 to-orange-500/40 text-white rounded-xl text-lg font-bold border border-white/30">
                          {product.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
