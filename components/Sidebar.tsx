
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LayoutDashboard, Package, Warehouse, Receipt, History, BarChart3 } from 'lucide-react-native';

const menuItems = [
  { path: '/(tabs)', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/(tabs)/products', label: 'Products', icon: Package },
  { path: '/(tabs)/inventory', label: 'Inventory', icon: Warehouse },
  { path: '/(tabs)/billing', label: 'Billing', icon: Receipt },
  { path: '/(tabs)/sales', label: 'Sales', icon: History },
  { path: '/(tabs)/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="w-64 bg-black/40 border-r border-white/30 hidden md:flex">
      <View className="p-6 border-b border-white/30">
        <Text className="text-2xl font-bold text-white drop-shadow-lg">SM Garments</Text>
      </View>
      <View className="p-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-white/30 text-white shadow-xl shadow-purple-500/30 border border-white/40' : 'text-white/90 hover:bg-white/20 border border-transparent hover:border-white/30'
              }`}
            >
              <Icon size={22} color="white" />
              <Text className="font-semibold text-base text-white">{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
