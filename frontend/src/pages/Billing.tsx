
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Plus, Trash2, ShoppingCart, Check } from 'lucide-react'
import api from '@/lib/axios'
import { Product, BillItemForm } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Billing = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<BillItemForm[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('1')

  const { data: products } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const res = await api.get('/products?' + params)
      return res.data
    }
  })

  const createBillMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/bills', { items: cart })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
      queryClient.invalidateQueries({ queryKey: ['dailyReport'] })
      queryClient.invalidateQueries({ queryKey: ['lowStock'] })
      setCart([])
      alert('Bill created successfully!')
    }
  })

  const addToCart = (product: Product) => {
    if (parseInt(quantity) > product.quantity) {
      alert('Insufficient stock!')
      return
    }

    const existingItem = cart.find(item => item.product_id === product.id)
    if (existingItem) {
      const newQuantity = existingItem.quantity + parseInt(quantity)
      if (newQuantity > product.quantity) {
        alert('Insufficient stock!')
        return
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: newQuantity, total_price: product.selling_price * newQuantity }
          : item
      ))
    } else {
      setCart([...cart, {
        product_id: product.id,
        quantity: parseInt(quantity),
        unit_price: product.selling_price,
        total_price: product.selling_price * parseInt(quantity)
      }])
    }
    setSelectedProduct(null)
    setQuantity('1')
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const updateCartQuantity = (index: number, newQuantity: number) => {
    const item = cart[index]
    const product = products?.find((p: Product) => p.id === item.product_id)
    if (product && newQuantity > product.quantity) {
      alert('Insufficient stock!')
      return
    }
    if (newQuantity <= 0) {
      removeFromCart(index)
      return
    }
    setCart(cart.map((itm, i) =>
      i === index ? { ...itm, quantity: newQuantity, total_price: itm.unit_price * newQuantity } : itm
    ))
  }

  const total = cart.reduce((sum, item) => sum + item.total_price, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    createBillMutation.mutate()
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Billing</h1>
        <p className="text-white/90 text-lg">Create a new bill</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 backdrop-blur-2xl bg-black/30 border-white/40 text-white placeholder-white/70 text-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {products?.filter((p: Product) => p.quantity > 0).map((product: Product) => (
                  <div
                    key={product.id}
                    className="border-2 border-white/40 rounded-xl p-4 cursor-pointer transition-all hover:border-white/60 hover:bg-white/10"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex gap-3">
                      {product.image_url ? (
                        <img
                          src={`http://localhost:5000${product.image_url}`}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                          <ShoppingCart size={32} className="text-white/80" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xl mb-1">{product.name}</h4>
                        <p className="text-white/80 text-base mb-1">{product.category}</p>
                        <p className="text-xl font-extrabold text-white">₹{product.selling_price.toFixed(2)}</p>
                        <p className="text-sm text-white/70 font-semibold">Stock: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className="mt-6 p-6 border-2 border-white/40 rounded-xl bg-black/30">
                  <h4 className="font-bold text-white text-2xl mb-3">Add to Cart: {selectedProduct.name}</h4>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label className="text-white/90 text-base mb-1 block">Quantity</Label>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        max={selectedProduct.quantity}
                        className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
                      />
                    </div>
                    <Button className="h-[46px] px-6 text-lg" onClick={() => addToCart(selectedProduct)}>
                      <Plus size={22} className="mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-white/80">
                  <ShoppingCart size={64} className="mx-auto mb-4 text-white/40" />
                  <p className="text-xl font-semibold">No items in cart</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                    {cart.map((item, index) => {
                      const product = products?.find((p: Product) => p.id === item.product_id)
                      return (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                          <div className="flex-1">
                            <p className="font-bold text-white text-lg">{product?.name}</p>
                            <p className="text-base text-white/80">₹{item.unit_price.toFixed(2)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCartQuantity(index, item.quantity - 1)}
                              className="hover:bg-white/20"
                            >
                              <span className="text-2xl font-bold">-</span>
                            </Button>
                            <span className="w-10 text-center text-white font-bold text-xl">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCartQuantity(index, item.quantity + 1)}
                              className="hover:bg-white/20"
                            >
                              <span className="text-2xl font-bold">+</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(index)}
                              className="hover:bg-red-500/30"
                            >
                              <Trash2 size={20} className="text-red-300" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/90 text-xl">Subtotal</span>
                      <span className="font-semibold text-white text-xl">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-extrabold">
                      <span className="text-white">Total</span>
                      <span className="text-white">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-8 h-14 text-xl"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={createBillMutation.isPending}
                  >
                    <Check size={24} className="mr-2" />
                    Checkout
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Billing
