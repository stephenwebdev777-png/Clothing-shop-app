
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Receipt, Package, Eye } from 'lucide-react'
import { format } from 'date-fns'
import api from '@/lib/axios'
import { BillWithItems } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Sales = () => {
  const [search, setSearch] = useState('')
  const [selectedBill, setSelectedBill] = useState<BillWithItems | null>(null)

  const { data: bills } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const res = await api.get('/bills')
      return res.data
    }
  })

  const filteredBills = bills?.filter((bill: BillWithItems) =>
    bill.bill_number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Sales</h1>
          <p className="text-white/90 text-lg">View all sales history</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <Input
              placeholder="Search bill number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 backdrop-blur-2xl bg-black/30 border-white/40 text-white placeholder-white/70 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bills List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredBills?.map((bill: BillWithItems) => (
            <Card key={bill.id} className="backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <Receipt size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-xl">Bill #{bill.bill_number}</h3>
                      <p className="text-white/80 text-base">{format(new Date(bill.created_at), 'MMM d, yyyy h:mm a')}</p>
                      <p className="text-white/70 text-sm">{bill.items.length} item(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-white">₹{bill.total_amount.toFixed(2)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-white/40 text-white"
                      onClick={() => setSelectedBill(bill)}
                    >
                      <Eye size={20} className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bill Details */}
        {selectedBill && (
          <div className="lg:col-span-1">
            <Card className="sticky top-6 backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="text-white text-2xl">Bill Details</CardTitle>
                <p className="text-base text-white/80">Bill #{selectedBill.bill_number}</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {selectedBill.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Package size={20} className="text-white/80" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">{item.product.name}</p>
                      <p className="text-base text-white/80">₹{item.unit_price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <p className="font-bold text-white text-lg">₹{item.total_price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t border-white/20 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-white text-xl">Total</span>
                    <span className="font-extrabold text-white text-2xl">₹{selectedBill.total_amount.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-white/70 mt-3">
                    {format(new Date(selectedBill.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sales
