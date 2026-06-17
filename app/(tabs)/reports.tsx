
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function ReportsScreen() {
  const { data: report } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await api.get('/reports/daily');
      return res.data;
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Reports</Text>
      <View style={styles.reportCard}>
        <View style={styles.reportIcon}>
          <BarChart3 size={28} color="#fff" />
        </View>
        <Text style={styles.reportTitle}>Daily Report</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Bills</Text>
            <Text style={styles.statValue}>{report?.total_bills || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>₹{(report?.total_revenue || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>
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
  reportCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  reportIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffffaa',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});
