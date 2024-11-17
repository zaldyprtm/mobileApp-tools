import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import tw from 'twrnc';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'; // Menggunakan FontAwesome5
import { IconSymbol } from '@/components/ui/IconSymbol.ios';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Menyesuaikan latar belakang transparan pada iOS untuk menampilkan efek blur
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
          },
          default: {
            backgroundColor: Colors[colorScheme ?? 'dark'].background,
          },
        }),
      }}
    >
      {/* Tab untuk Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={28} color={color} style={tw`text-black font-bold text-lg`} />
          ),
        }}
      />

      {/* Tab untuk Tools */}
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="wrench" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tes"
        options={{
          title: 'Tes',
          tabBarIcon: ({ color }) => (
            <AntDesign name="plus" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
