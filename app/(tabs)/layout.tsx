import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform } from 'react-native';

// Centralized theme — move this to a shared `theme.ts` / `constants/theme.ts`
// file and import it here + everywhere else once you have more screens.
export const theme = {
  colors: {
    primary: '#0E4D92',
    accent: '#E63946',
    card: '#FFFFFF',
    background: '#F8FAFC',
    text: '#1E293B',
    subText: '#64748B',
    border: '#E5E7EB',
  },
  fontFamily: {
    sans: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    bold: 'Poppins_700Bold',
  },
};

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  products: { active: 'cube', inactive: 'cube-outline' },
  services: { active: 'construct', inactive: 'construct-outline' },
  gallery: { active: 'images', inactive: 'images-outline' },
  cart: { active: 'cart', inactive: 'cart-outline' },
  contact: { active: 'call', inactive: 'call-outline' },
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subText,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: theme.fontFamily.medium,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="products" options={{ title: 'Products' }} />
      <Tabs.Screen name="services" options={{ title: 'Services' }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: undefined, // wire up to cart item count later, e.g. cartCount > 0 ? cartCount : undefined
          tabBarBadgeStyle: { backgroundColor: theme.colors.accent },
        }}
      />
      <Tabs.Screen name="contact" options={{ title: 'Contact' }} />
    </Tabs>
  );
}
