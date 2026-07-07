// import { useEffect } from 'react';
// import { Slot } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { RootProviders } from '@/providers/root-providers';
// import { useAuth } from '@/features/auth/auth-provider';

// // Prevent the splash from auto-hiding
// // SplashScreen.preventAutoHideAsync();

// //  export default function RootLayout() {
// // //   const { isLoading, user } = useAuth(); // your auth hook

// // //   useEffect(() => {
// // //     if (!isLoading) {
// // //       SplashScreen.hideAsync(); // hide when loading finishes
// // //     }
// // //   }, [isLoading]);

// // //   if (isLoading) {
// // //     return null; // or a loading indicator while splash is shown
// // //   }

// //   return (
// //     <RootProviders>
// //       <Slot />
// //     </RootProviders>
// //   );
// // }

// export default function RootLayout() {
//   const { isLoading , token } = useAuth();

//    useEffect(() => {
//       if (!isLoading) {
//           SplashScreen.hideAsync(); // hide when user is authenticated
//         }
//       }, [isLoading]);

//       if (isLoading) {
//           return null; // or a loading indicator while splash is shown
//         }

// //   if (!isAuthenticated) {
// //     return null; // or a loading indicator while splash is shown
// //   }

// //   return (
// //     <RootProviders>
// //       <Slot />
// //     </RootProviders>
// //   );
// // }

//  if (!token) {
//     return <Slot />; // This will render the (auth) routes
//   }

//   // Otherwise show the main tabs
//   return <Slot />; // This will render the (tabs) routes
// }


import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/features/auth/auth-provider';

// Prevent the splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // --- DEBUGGING: Log immediately ---
  console.log('1. RootLayout function is running');

  let authContext;
  try {
    authContext = useAuth();
    console.log('2. useAuth() returned successfully:', authContext);
  } catch (error) {
    console.error('3. useAuth() CRASHED!', error);
    // If it crashes, we force-hide the splash and show an error screen so you see it
    SplashScreen.hideAsync();
    return (
      <div style={{ padding: 20, color: 'red' }}>
        <h1>Auth Context Error</h1>
        <p>There was an error initializing the authentication context.</p>
      
      </div>
    );
  }
 
   const { isLoading, token } = authContext || { isLoading: true, token: null };
  console.log('4. isLoading:', isLoading, 'token:', token);

  useEffect(() => {
    console.log('5. useEffect triggered. isLoading:', isLoading);
    if (!isLoading) {
      console.log('6. Hiding splash now!');
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    console.log('Auth loading...');
    return null; // or a loading spinner
  }

  console.log('Rendering app, token:', token);
  return <Slot />;
}