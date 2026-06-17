
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Package, Receipt, TrendingUp, AlertTriangle } from 'lucide-react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE']

const Reports = () => {
  const { data: report } = useQuery({
    queryKey: ['dailyReport'],
    queryFn: async () => {
      const res = await api.get('/reports/daily')
      return res.data
    }
  })

  const chartData = report?.top_selling_products?.map((product: any, index: number) => ({
    name: product.name,
    revenue: product.total_revenue,
    color: COLORS[index % COLORS.length]
  })) || []

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Reports</h1>
        <p className="text-white/90 text-lg">Today's sales and inventory reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="backdrop-blur-2xl bg-black/30 border-2 border-blue-400/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Receipt size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 mb-1">Today's Bills</p>
                <p className="text-2xl font-extrabold text-white">{report?.total_bills || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-2xl bg-black/30 border-2 border-purple-400/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 mb-1">Today's Revenue</p>
                <p className="text-2xl font-extrabold text-white">₹{(report?.total_revenue || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-2xl bg-black/30 border-2 border-green-400/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
                <Package size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 mb-1">Total Products</p>
                <p className="text-2xl font-extrabold text-white">{report?.total_products || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-2xl bg-black/30 border-2 border-red-400/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                <AlertTriangle size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 mb-1">Low Stock Items</p>
                <p className="text-2xl font-extrabold text-white">{report?.low_stock_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="backdrop-blur-2xl bg-black/30 border-2 border-purple-400/50 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Top Selling Products (Today)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.9)" 
                  tick={{ fill: 'white', fontSize: 14, fontWeight: 600 }} 
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.9)" 
                  tick={{ fill: 'white', fontSize: 14, fontWeight: 600 }} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: 'white', fontWeight: 700, fontSize: 16 }}
                  labelStyle={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 8 }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[12, 12, 0, 0]}>
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports
