import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useEffect, useState } from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();

const customTheme = {
  colors: {
    primary: "rgb(140, 29, 213)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(242, 218, 255)",
    onPrimaryContainer: "rgb(46, 0, 77)",
    secondary: "#CCFFCB",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "#4CCE88",
    onSecondaryContainer: "rgb(0, 33, 16)",
    tertiary: "rgb(129, 81, 85)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 218, 219)",
    onTertiaryContainer: "rgb(51, 16, 20)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "rgb(234, 223, 234)",
    onSurfaceVariant: "rgb(75, 69, 77)",
    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(205, 195, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(246, 239, 243)",
    inversePrimary: "rgb(225, 182, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(249, 240, 253)",
      level2: "rgb(246, 233, 252)",
      level3: "rgb(242, 227, 250)",
      level4: "rgb(241, 224, 250)",
      level5: "rgb(239, 220, 249)",
    },
    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    backdrop: "rgba(52, 46, 55, 0.4)",
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...customTheme.colors,
  },
};

export function App() {
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

    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return null;
  }

  // const theme = useTheme();

  return (
    <PaperProvider theme={theme}>
      <Navigation
        linking={{
          enabled: "auto",
          prefixes: ["helloworld://"],
          config: {
            screens: {
              HomeTabs: "home",
              Login: "login",
              Profile: ":user",
              Settings: "settings",
              SellerProfile: "seller/:user",
              FAQ: "faq",
              Cart: "cart",
              Recipes: "recipes",
              NotFound: "*",
            },
          },
        }}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
      />
    </PaperProvider>
  );
}
