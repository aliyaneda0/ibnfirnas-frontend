import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { RootProviders } from '@/providers/root-providers';
import { useAuth } from '@/features/auth/auth-provider';

// Prevent the splash from auto-hiding
SplashScreen.preventAutoHideAsync();

//  export default function RootLayout() {
// //   const { isLoading, user } = useAuth(); // your auth hook

// //   useEffect(() => {
// //     if (!isLoading) {
// //       SplashScreen.hideAsync(); // hide when loading finishes
// //     }
// //   }, [isLoading]);

// //   if (isLoading) {
// //     return null; // or a loading indicator while splash is shown
// //   }

//   return (
//     <RootProviders>
//       <Slot />
//     </RootProviders>
//   );
// }

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      SplashScreen.hideAsync(); // hide when user is authenticated
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // or a loading indicator while splash is shown
  }

  return (
    <RootProviders>
      <Slot />
    </RootProviders>
  );
}