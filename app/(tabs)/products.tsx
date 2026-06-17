
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react-native';
import api from '@/lib/axios';

export default function ProductsScreen() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Products</Text>
      {products?.map((product: any) => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.productIcon}>
            <Package size={24} color="#fff" />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>₹{product.selling_price.toFixed(2)}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>{product.quantity}</Text>
            <Text style={styles.quantityLabel}>in stock</Text>
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
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  productIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productInfo: {
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
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quantityContainer: {
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#ffffffaa',
  },
});
