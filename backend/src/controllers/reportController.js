
const getDailyReport = async (req, res) => {
  try {
    const db = req.db;
    const today = new Date().toISOString().split('T')[0];
    const todayBills = db.data.bills.filter(b => new Date(b.createdAt || b.created_at).toISOString().split('T')[0] === today);

    const totalBills = todayBills.length;
    const totalRevenue = todayBills.reduce((sum, bill) => sum + (bill.totalAmount || bill.total_amount), 0);
    const totalProducts = db.data.products.length;
    const totalStock = db.data.products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = db.data.products.filter(p => p.quantity < 5).length;

    const productSales = {};
    todayBills.forEach(bill => {
      const billItems = db.data.billItems.filter(bi => (bi.billId || bi.bill_id) === bill.id);
      billItems.forEach(item => {
        const productId = item.productId || item.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            total_quantity: 0,
            total_revenue: 0
          };
        }
        productSales[productId].total_quantity += item.quantity;
        productSales[productId].total_revenue += (item.totalPrice || item.total_price);
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const product = db.data.products.find(p => p.id === parseInt(productId));
        return {
          id: parseInt(productId),
          name: product?.name || 'Unknown',
          ...sales
        };
      })
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5);

    res.json({
      total_bills: totalBills,
      total_revenue: totalRevenue,
      total_products: totalProducts,
      total_stock: totalStock,
      low_stock_count: lowStockCount,
      top_selling_products: topSellingProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWeeklyReport = async (req, res) => {
  try {
    const db = req.db;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyBills = db.data.bills.filter(b => new Date(b.createdAt || b.created_at) >= weekAgo);

    const totalBills = weeklyBills.length;
    const totalRevenue = weeklyBills.reduce((sum, bill) => sum + (bill.totalAmount || bill.total_amount), 0);

    const productSales = {};
    weeklyBills.forEach(bill => {
      const billItems = db.data.billItems.filter(bi => (bi.billId || bi.bill_id) === bill.id);
      billItems.forEach(item => {
        const productId = item.productId || item.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            total_quantity: 0,
            total_revenue: 0
          };
        }
        productSales[productId].total_quantity += item.quantity;
        productSales[productId].total_revenue += (item.totalPrice || item.total_price);
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const product = db.data.products.find(p => p.id === parseInt(productId));
        return {
          id: parseInt(productId),
          name: product?.name || 'Unknown',
          ...sales
        };
      })
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5);

    res.json({
      total_bills: totalBills,
      total_revenue: totalRevenue,
      top_selling_products: topSellingProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const db = req.db;
    const now = new Date();
    const monthlyBills = db.data.bills.filter(b => {
      const billDate = new Date(b.createdAt || b.created_at);
      return billDate.getMonth() === now.getMonth() && billDate.getFullYear() === now.getFullYear();
    });

    const totalBills = monthlyBills.length;
    const totalRevenue = monthlyBills.reduce((sum, bill) => sum + (bill.totalAmount || bill.total_amount), 0);

    const productSales = {};
    monthlyBills.forEach(bill => {
      const billItems = db.data.billItems.filter(bi => (bi.billId || bi.bill_id) === bill.id);
      billItems.forEach(item => {
        const productId = item.productId || item.product_id;
        if (!productSales[productId]) {
          productSales[productId] = {
            total_quantity: 0,
            total_revenue: 0
          };
        }
        productSales[productId].total_quantity += item.quantity;
        productSales[productId].total_revenue += (item.totalPrice || item.total_price);
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([productId, sales]) => {
        const product = db.data.products.find(p => p.id === parseInt(productId));
        return {
          id: parseInt(productId),
          name: product?.name || 'Unknown',
          ...sales
        };
      })
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5);

    res.json({
      total_bills: totalBills,
      total_revenue: totalRevenue,
      top_selling_products: topSellingProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDailyReport, getWeeklyReport, getMonthlyReport };

