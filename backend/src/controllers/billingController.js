
const formatBillItem = (item) => ({
  ...item,
  product_id: item.product_id || item.productId,
  bill_id: item.bill_id || item.billId,
  unit_price: item.unit_price || item.unitPrice,
  total_price: item.total_price || item.totalPrice,
  product_name: item.product_name || item.productName
});

const formatBill = (bill) => ({
  ...bill,
  bill_number: bill.bill_number || bill.billNumber,
  total_amount: bill.total_amount || bill.totalAmount,
  created_at: bill.created_at || bill.createdAt
});

const getBills = async (req, res) => {
  try {
    const db = req.db;
    const { search, startDate, endDate } = req.query;
    let bills = [...db.data.bills];

    if (search) {
      const searchLower = search.toLowerCase();
      bills = bills.filter(b => (b.billNumber || b.bill_number).toLowerCase().includes(searchLower));
    }

    if (startDate) {
      bills = bills.filter(b => new Date(b.createdAt || b.created_at) >= new Date(startDate));
    }

    if (endDate) {
      bills = bills.filter(b => new Date(b.createdAt || b.created_at) <= new Date(endDate));
    }

    bills.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
    
    const billsWithItems = bills.map(bill => {
      const billItems = db.data.billItems.filter(bi => (bi.billId || bi.bill_id) === bill.id).map(bi => {
        const product = db.data.products.find(p => p.id === (bi.productId || bi.product_id));
        return {
          ...formatBillItem(bi),
          product: product || null
        };
      });
      return {
        ...formatBill(bill),
        items: billItems
      };
    });
    
    res.json(billsWithItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBillById = async (req, res) => {
  try {
    const db = req.db;
    const { id } = req.params;
    const bill = db.data.bills.find(b => b.id === parseInt(id));

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    const billItems = db.data.billItems.filter(bi => (bi.billId || bi.bill_id) === parseInt(id)).map(bi => {
      const product = db.data.products.find(p => p.id === (bi.productId || bi.product_id));
      return formatBillItem({
        ...bi,
        productName: product?.name || 'Unknown'
      });
    });

    res.json({
      ...formatBill(bill),
      items: billItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createBill = async (req, res) => {
  try {
    const db = req.db;
    const { items } = req.body;

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const todayBills = db.data.bills.filter(b => new Date(b.createdAt || b.created_at).toISOString().split('T')[0] === dateStr);
    const billNumber = `BL-${dateStr}-${String(todayBills.length + 1).padStart(4, '0')}`;

    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.total_price || item.totalPrice;
    });

    const newBill = {
      id: Date.now(),
      billNumber,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    db.data.bills.push(newBill);

    for (const item of items) {
      const newBillItem = {
        id: Date.now() + Math.random(),
        billId: newBill.id,
        productId: item.product_id || item.productId,
        quantity: item.quantity,
        unitPrice: item.unit_price || item.unitPrice,
        totalPrice: item.total_price || item.totalPrice
      };
      db.data.billItems.push(newBillItem);

      const productIndex = db.data.products.findIndex(p => p.id === (item.product_id || item.productId));
      if (productIndex !== -1) {
        db.data.products[productIndex].quantity -= item.quantity;
      }

      db.data.stockMovements.push({
        id: Date.now() + Math.random(),
        productId: item.product_id || item.productId,
        movementType: 'OUT',
        quantity: item.quantity,
        notes: `Sale - Bill ${billNumber}`,
        createdAt: new Date().toISOString()
      });
    }

    await db.write();

    const billItems = db.data.billItems.filter(bi => bi.billId === newBill.id).map(bi => {
      const product = db.data.products.find(p => p.id === bi.productId);
      return formatBillItem({
        ...bi,
        productName: product?.name || 'Unknown'
      });
    });

    res.status(201).json({
      ...formatBill(newBill),
      items: billItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBills, getBillById, createBill };

