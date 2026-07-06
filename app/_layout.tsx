import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { RootProviders } from '@/providers/root-providers';
import { useAuth } from '@/features/auth/auth-provider';

// Prevent the splash from auto-hiding
// SplashScreen.preventAutoHideAsync();

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
  const { isLoading , token } = useAuth();

   useEffect(() => {
      if (!isLoading) {
          SplashScreen.hideAsync(); // hide when user is authenticated
        }
      }, [isLoading]);

      if (isLoading) {
          return null; // or a loading indicator while splash is shown
        }

//   if (!isAuthenticated) {
//     return null; // or a loading indicator while splash is shown
//   }

//   return (
//     <RootProviders>
//       <Slot />
//     </RootProviders>
//   );
// }

 if (!token) {
    return <Slot />; // This will render the (auth) routes
  }

  // Otherwise show the main tabs
  return <Slot />; // This will render the (tabs) routes
}