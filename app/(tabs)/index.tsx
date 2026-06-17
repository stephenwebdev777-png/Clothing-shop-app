
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Package, Warehouse, Receipt, AlertTriangle, Plus, ShoppingCart } from 'lucide-react-native';
import api from '@/lib/axios';

export default function DashboardScreen() {
  const router = useRouter();

  const { data: report } = useQuery({
    queryKey: ['dailyReport'],
    queryFn: async () => {
      const res = await api.get('/reports/daily');
      return res.data;
    },
  });

  const { data: lowStock } = useQuery({
    queryKey: ['lowStock'],
    queryFn: async () => {
      const res = await api.get('/inventory/low-stock');
      return res.data;
    },
  });

  const stats = [
    { title: 'Total Products', value: report?.total_products || 0, icon: Package, color: '#3b82f6' },
    { title: 'Total Stock', value: report?.total_stock || 0, icon: Warehouse, color: '#22c55e' },
    { title: "Today's Sales", value: `₹${(report?.total_revenue || 0).toFixed(2)}`, isRupee: true, color: '#a855f7' },
    { title: "Today's Bills", value: report?.total_bills || 0, icon: Receipt, color: '#f97316' },
    { title: 'Low Stock', value: report?.low_stock_count || 0, icon: AlertTriangle, color: '#ef4444' },
  ];

  const quickActions = [
    { label: 'Create Bill', icon: ShoppingCart, onClick: () => router.push('/(tabs)/billing'), color: '#8b5cf6' },
    { label: 'Add Product', icon: Plus, onClick: () => router.push('/(tabs)/products'), color: '#ec4899' },
    { label: 'Add Stock', icon: Warehouse, onClick: () => router.push('/(tabs)/inventory'), color: '#10b981' },
    { label: 'View Inventory', icon: Package, onClick: () => router.push('/(tabs)/inventory'), color: '#f59e0b' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome to your SM Garments management system</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={[styles.statCard, { borderColor: stat.color + '80' }]}>
              <View style={styles.statInner}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  {stat.isRupee ? (
                    <Text style={styles.rupeeIcon}>₹</Text>
                  ) : (
                    <Icon size={32} color="white" />
                  )}
                </View>
                <View style={styles.statText}>
                  <Text style={styles.statLabel}>{stat.title}</Text>
                  <Text style={[styles.statValue, stat.title === "Today's Sales" ? styles.salesValue : {}]}>{stat.value}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={action.onClick}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Icon size={36} color="white" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {lowStock && lowStock.length > 0 && (
        <View style={styles.lowStockContainer}>
          <View style={styles.lowStockHeader}>
            <View style={styles.lowStockTitleRow}>
              <AlertTriangle size={28} color="#fca5a5" />
              <Text style={styles.lowStockTitle}>Low Stock Products</Text>
            </View>
          </View>
          <View style={styles.lowStockContent}>
            {lowStock.map((product: any) => (
              <View key={product.id} style={styles.lowStockItem}>
                <View style={styles.productLeft}>
                  <View style={styles.productIcon}>
                    <Package size={24} color="rgba(255,255,255,0.8)" />
                  </View>
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
                <Text style={styles.productCategory}>{product.category}</Text>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{product.quantity}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 32,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
  },
  statInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rupeeIcon: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  salesValue: {
    fontSize: 20,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    minWidth: 180,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  lowStockContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    marginBottom: 32,
  },
  lowStockHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  lowStockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lowStockTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lowStockContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  lowStockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  productCategory: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  quantityBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
