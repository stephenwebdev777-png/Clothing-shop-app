
const formatProduct = (product) => ({
  ...product,
  purchase_price: product.purchase_price || product.purchasePrice,
  selling_price: product.selling_price || product.sellingPrice,
  image_url: product.image_url || product.imageUrl,
  created_at: product.created_at || product.createdAt
});

const getProducts = async (req, res) => {
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

const getProductById = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const product = db.data.products.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatProduct(product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT RECEIVED ===');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const db = req.db;
    let { name, category, material, color, size, brand, purchase_price, selling_price, quantity } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    // Ensure numeric fields are numbers
    purchase_price = parseFloat(purchase_price);
    selling_price = parseFloat(selling_price);
    quantity = parseInt(quantity);

    console.log('Processed data:', { name, category, purchase_price, selling_price, quantity });

    const newProduct = {
      id: Date.now(),
      name,
      category,
      material,
      color,
      size,
      brand,
      purchase_price: purchase_price,
      selling_price: selling_price,
      quantity: quantity,
      image_url,
      created_at: new Date().toISOString()
    };

    db.data.products.push(newProduct);

    if (quantity > 0) {
      db.data.stockMovements.push({
        id: Date.now(),
        productId: newProduct.id,
        movementType: 'IN',
        quantity: quantity,
        notes: 'Initial stock',
        createdAt: new Date().toISOString()
      });
    }

    await db.write();
    console.log('Product created successfully:', newProduct);
    res.status(201).json(formatProduct(newProduct));
  } catch (error) {
    console.error('ERROR creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

const updateProduct = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const { name, category, material, color, size, brand, purchase_price, selling_price } = req.body;
    
    const productIndex = db.data.products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let image_url = db.data.products[productIndex].image_url || db.data.products[productIndex].imageUrl;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    db.data.products[productIndex] = {
      ...db.data.products[productIndex],
      name,
      category,
      material,
      color,
      size,
      brand,
      purchase_price: parseFloat(purchase_price),
      selling_price: parseFloat(selling_price),
      image_url
    };

    await db.write();
    res.json(formatProduct(db.data.products[productIndex]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const initialLength = db.data.products.length;
    db.data.products = db.data.products.filter(p => p.id !== parseInt(id));

    if (db.data.products.length === initialLength) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.write();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
