
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react-native';
import api from '@/lib/axios';
import { format } from 'date-fns';

export default function SalesScreen() {
  const { data: bills } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const res = await api.get('/bills');
      return res.data;
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Sales History</Text>
      {bills?.map((bill: any) => (
        <View key={bill.id} style={styles.billCard}>
          <View style={styles.billIcon}>
            <History size={24} color="#fff" />
          </View>
          <View style={styles.billInfo}>
            <Text style={styles.billNumber}>{bill.bill_number}</Text>
            <Text style={styles.billDate}>{format(new Date(bill.created_at), 'MMM d, yyyy h:mm a')}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>₹{bill.total_amount.toFixed(2)}</Text>
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
  billCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  billIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  billInfo: {
    flex: 1,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  billDate: {
    fontSize: 14,
    color: '#ffffffaa',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
