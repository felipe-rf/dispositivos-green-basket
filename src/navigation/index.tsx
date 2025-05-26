import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import bell from "../assets/bell.png";
import newspaper from "../assets/newspaper.png";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { SellerProfile } from "./screens/SellerProfile";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import { Login } from "./screens/Login";
import { FAQ } from "./screens/FAQ";
import { Catalog } from "./screens/Catalog";
import { Avatar, IconButton } from "react-native-paper";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Feed",
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
    Updates: {
      screen: Updates,
      options: {
        tabBarIcon: ({ color, size }) => (
          <Image
            source={bell}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: "#4CCE88",
      shadowColor: "transparent",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerLeft: () => (
      <Avatar.Icon
        size={40}
        icon="account"
        style={{
          color: "#fff",
          backgroundColor: "#fff",
          marginLeft: 10,
          marginRight: 10,
        }}
      />
    ),
    headerRight: () => (
      <>
        <IconButton
          icon="magnify"
          iconColor="#fff"
          size={28}
          onPress={() => {}}
        />
        <IconButton
          icon="cart-outline"
          iconColor="#fff"
          size={28}
          onPress={() => {}}
        />
      </>
    ),
  },
  screens: {
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      options: ({ route }) => ({
        title: `Perfil: ${route.params.user}`,
      }),
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    SellerProfile: {
      screen: SellerProfile,
      options: ({ route }) => ({
        title: `Vendedor: ${route.params.user}`,
      }),
      linking: {
        path: "seller/:user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    FAQ: {
      screen: FAQ,
      options: {
        title: "Perguntas Frequentes",
      },
    },
    Catalog: {
      screen: Catalog,
      options: {
        title: "Catálogo de Produtos",
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack, {
  initialRouteName: "Login",
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
