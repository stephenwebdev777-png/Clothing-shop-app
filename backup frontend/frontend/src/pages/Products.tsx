
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Product } from '@/types'

const categories = [
  'Saree',
  'Shirt',
  'Churidar',
  'Nightwear',
  'Kids Wear',
  'Kurti',
  'Leggings',
  'T-Shirt',
  'Jeans',
  'Jacket',
]

const Products = () => {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { data: products } = useQuery({
    queryKey: ['products', search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)
      const res = await api.get('/products?' + params)
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await api.put('/products/' + id, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
      setEditingProduct(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete('/products/' + id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleSubmit = (data: any) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key]) formData.append(key, data[key])
    })
    if (data.image && data.image[0]) formData.append('image', data.image[0])

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-xl mb-2">Products</h1>
          <p className="text-white/90 text-lg">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={22} className="mr-2" />
          Add Product
        </Button>
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
              className="pl-12 backdrop-blur-2xl bg-black/30 border-white/40 text-white placeholder-white/70 focus:border-white/60 text-lg"
            />
          </div>
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: Product) => (
          <Card
            key={product.id}
            className="backdrop-blur-2xl bg-black/30 border-2 border-white/40 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img
                      src={`http://localhost:5000${product.image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                      <Package size={36} className="text-white/80" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-xl mb-1">{product.name}</h3>
                  <p className="text-white/80 text-base mb-2">{product.category}</p>
                  <div className="flex gap-2 mb-3">
                    {product.color && (
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-lg text-white font-semibold">
                        {product.color}
                      </span>
                    )}
                    {product.size && (
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-lg text-white font-semibold">
                        {product.size}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xl font-extrabold text-white">
                        ₹{product.selling_price.toFixed(2)}
                      </p>
                      <p className="text-sm text-white/70 font-semibold">
                        Stock: {product.quantity}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="hover:bg-white/20"
                      >
                        <Edit size={20} className="text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="hover:bg-red-500/30"
                      >
                        <Trash2 size={20} className="text-red-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-2xl bg-black/40 border-white/40 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={editingProduct}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsModalOpen(false)
                  setEditingProduct(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

const ProductForm = ({
  product,
  onSubmit,
  onCancel,
}: {
  product: any
  onSubmit: (data: any) => void
  onCancel: () => void
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          material: product.material,
          color: product.color,
          size: product.size,
          brand: product.brand,
          purchase_price: product.purchase_price,
          selling_price: product.selling_price,
          quantity: product.quantity,
        }
      : {},
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white/90 text-base">Product Name *</Label>
          <Input
            {...register('name', { required: true })}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Category *</Label>
          <Select
            {...register('category', { required: true })}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="text-white/90 text-base">Material</Label>
          <Input
            {...register('material')}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Color</Label>
          <Input
            {...register('color')}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Size</Label>
          <Input
            {...register('size')}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Brand</Label>
          <Input
            {...register('brand')}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Purchase Price *</Label>
          <Input
            type="number"
            step="0.01"
            {...register('purchase_price', { required: true })}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        <div>
          <Label className="text-white/90 text-base">Selling Price *</Label>
          <Input
            type="number"
            step="0.01"
            {...register('selling_price', { required: true })}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
        {!product && (
          <div>
            <Label className="text-white/90 text-base">Initial Quantity *</Label>
            <Input
              type="number"
              {...register('quantity', { required: true })}
              className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
            />
          </div>
        )}
        <div>
          <Label className="text-white/90 text-base">Product Image</Label>
          <Input
            type="file"
            accept="image/*"
            {...register('image')}
            className="backdrop-blur-2xl bg-black/30 border-white/40 text-white text-lg"
          />
        </div>
      </div>
      <div className="flex gap-4 justify-end pt-6">
        <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-white/40 text-white"
      >
        Cancel
      </Button>
        <Button type="submit">{product ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  )
}

export default Products
