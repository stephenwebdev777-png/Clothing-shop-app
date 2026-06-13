
const formatProduct = (product) => ({
  ...product,
  purchase_price: product.purchase_price || product.purchasePrice,
  selling_price: product.selling_price || product.sellingPrice,
  image_url: product.image_url || product.imageUrl,
  created_at: product.created_at || product.createdAt
});

const getInventory = async (req, res) => {
  try {
    const db = req.db;
    const { search, category } = req.query;
    let products = [...db.data.products];

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.category.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    products.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    res.json(products.map(formatProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const db = req.db;
    const { product_id, movement_type, quantity, notes } = req.body;

    const productIndex = db.data.products.findIndex(p => p.id === parseInt(product_id));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = db.data.products[productIndex];
    let newQuantity = product.quantity;

    if (movement_type === 'IN') {
      newQuantity += parseInt(quantity);
    } else if (movement_type === 'OUT') {
      if (parseInt(quantity) > product.quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      newQuantity -= parseInt(quantity);
    } else {
      return res.status(400).json({ message: 'Invalid movement type' });
    }

    db.data.products[productIndex].quantity = newQuantity;
    db.data.stockMovements.push({
      id: Date.now(),
      productId: parseInt(product_id),
      movementType: movement_type,
      quantity: parseInt(quantity),
      notes,
      createdAt: new Date().toISOString()
    });

    await db.write();
    res.json(formatProduct(db.data.products[productIndex]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const db = req.db;
    const threshold = 5;
    const lowStockProducts = db.data.products.filter(p => p.quantity < threshold);
    lowStockProducts.sort((a, b) => a.quantity - b.quantity);
    res.json(lowStockProducts.map(formatProduct));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getInventory, updateStock, getLowStock };

