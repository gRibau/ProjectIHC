import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="star" size={size ?? 24} color={color} solid />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Bilhetes',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="ticket-alt" size={size ?? 24} color={color} solid />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marker-alt" size={size ?? 24} color={color} solid />
          ),
        }}
      />
      <Tabs.Screen
        name="lines"
        options={{
          title: 'Linhas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="bus" size={size ?? 24} color={color} solid />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Mais',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="ellipsis-h" size={size ?? 24} color={color} solid />
          ),
        }}
      />
    </Tabs>
  );
}
