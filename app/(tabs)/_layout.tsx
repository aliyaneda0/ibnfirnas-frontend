import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="services" options={{ title: "Services" }} />
      <Tabs.Screen name="products" options={{ title: "Products" }} />
      <Tabs.Screen name="gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="contact" options={{ title: "Contact" }} />
    </Tabs>
  );
}
