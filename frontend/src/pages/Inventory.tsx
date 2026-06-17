
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, Plus, Search, ArrowUp, ArrowDown } from 'lucide-react'
import api from '@/lib/axios'
import { Product } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const categories = [
  'Saree', 'Shirt', 'Churidar', 'Nightwear', 'Kids Wear', 'Kurti', 'Leggings', 'T-Shirt', 'Jeans', 'Jacket'
]

const Inventory = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: products } = useQuery({
    queryKey: ['inventory', search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)
      const res = await api.get('/inventory?' + params)
      return res.data
    }
  })

  const updateStockMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) return
      const res = await api.post('/inventory/update', {
        product_id: selectedProduct.id,
        movement_type: movementType,
        quantity: parseInt(quantity),
        notes: notes
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['dailyReport'] })
      queryClient.invalidateQueries({ queryKey: ['lowStock'] })
      setIsModalOpen(false)
      setSelectedProduct(null)
      setQuantity('')
      setNotes('')
    }
  })

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateStockMutation.mutate()
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Inventory</h1>
        <p className="text-white/90 text-lg">View and manage your stock</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 backdrop-blur-2xl bg-black/30 border-white/40 text-white placeholder-white/70 text-lg"
            />
          </div>
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </Select>
      </div>

      {/* Inventory Table */}
      <Card className="backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Product</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Category</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Color</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Size</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Stock</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Price</th>
                  <th className="text-left py-4 px-6 text-lg font-bold text-white/90">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product) => (
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
                    <td className="py-4 px-6 text-white/90 text-lg">{product.color || '-'}</td>
                    <td className="py-4 px-6 text-white/90 text-lg">{product.size || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-5 py-2 rounded-xl text-lg font-bold border ${
                        product.quantity < 5
                          ? 'bg-red-500/40 text-red-300 border-red-300/50'
                          : product.quantity < 10
                          ? 'bg-yellow-500/40 text-yellow-300 border-yellow-300/50'
                          : 'bg-green-500/40 text-green-300 border-green-300/50'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-extrabold text-xl">₹{product.selling_price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStock(product)} className="border-white/40 text-white">
                        <Plus size={20} className="mr-1" />
                        Update Stock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pb-32 z-50 overflow-y-auto">
          <Card className="w-full max-w-md my-4 backdrop-blur-2xl bg-black/40 border-white/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Update Stock - {selectedProduct.name}</CardTitle>
              <p className="text-base text-white/80">Current Stock: {selectedProduct.quantity}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/90 text-base">Movement Type</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-white text-lg font-semibold">
                      <input
                        type="radio" value="IN" checked={movementType === 'IN'}
                        onChange={(e) => setMovementType(e.target.value as 'IN' | 'OUT')}
                        className="text-blue-500"
                      />
                      <ArrowUp size={20} className="text-green-400" />
                      Stock In
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white text-lg font-semibold">
                      <input
                        type="radio" value="OUT" checked={movementType === 'OUT'}
                        onChange={(e) => setMovementType(e.target.value as 'IN' | 'OUT')}
                        className="text-blue-500"
                      />
                      <ArrowDown size={20} className="text-red-400" />
                      Stock Out
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-white/90 text-base">Quantity</Label>
                  <Input
                    type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                    min="1" required className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
                  />
                </div>
                <div>
                  <Label className="text-white/90 text-base">Notes</Label>
                  <Input
                    value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes"
                    className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
                  />
                </div>
                <div className="flex gap-4 justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsModalOpen(false); setSelectedProduct(null); }}
                    className="border-white/40 text-white"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateStockMutation.isPending}>Update</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Inventory
