
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Warehouse } from 'lucide-react-native';
import api from '@/lib/axios';

export default function InventoryScreen() {
  const { data: products } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Inventory</Text>
      {products?.map((product: any) => (
        <View key={product.id} style={styles.inventoryCard}>
          <View style={styles.inventoryIcon}>
            <Warehouse size={24} color="#fff" />
          </View>
          <View style={styles.inventoryInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
          <View style={styles.stockContainer}>
            <Text style={[styles.stock, product.quantity < 10 ? styles.lowStock : {}]}>
              {product.quantity}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4f46e5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inventoryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  inventoryIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  inventoryInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  productCategory: {
    fontSize: 14,
    color: '#ffffffaa',
  },
  stockContainer: {
    alignItems: 'center',
  },
  stock: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  lowStock: {
    color: '#ef4444',
  },
});
