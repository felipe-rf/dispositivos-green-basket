import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { useTheme } from "react-native-paper";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const theme = useTheme();
  theme.dark = false;
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [initializing]);

  // Don't render until we have determined the authentication state
  if (initializing) {
    return null;
  }

  return (
    <Navigation
      linking={{
        enabled: "auto",
        prefixes: [
          // Change the scheme to match your app's scheme defined in app.json
          "helloworld://",
        ],
        config: {
          screens: {
            Login: 'login',
            HomeTabs: 'home',
            Profile: ':user',
            Settings: 'settings',
            NotFound: '*',
          },
        },
      }}
      onReady={() => {
        SplashScreen.hideAsync();
      }}
    />
  );
}
