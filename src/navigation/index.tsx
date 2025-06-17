import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { SellerProfile } from "./screens/SellerProfile";
import { Settings } from "./screens/Settings";
import { NotFound } from "./screens/NotFound";
import { Login } from "./screens/Login";

import { FAQ } from "./screens/FAQ";
import { Catalog } from "./screens/Catalog";
import { Cart } from "./screens/Cart";
import { Orders } from "./screens/Orders";
import { Recipes } from "./screens/Recipes";
import { Avatar, IconButton, TouchableRipple } from "react-native-paper";
import { Checkout } from "./screens/Checkout";
import { ProductInfo } from "./screens/ProductInfo";

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: {
      backgroundColor: "#4CCE88",
      shadowColor: "transparent",
      elevation: 0,
      borderBottomWidth: 0,
      borderBottomColor: "transparent",
      shadowOpacity: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 0,
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerLeft: () => {
      const navigation = useNavigation();
      return (
        <TouchableRipple onPress={() => navigation.navigate("Catalog")}>
          <Avatar.Icon
            size={40}
            icon="home-outline"
            style={{
              backgroundColor: "#fff",
              marginLeft: 10,
              marginRight: 10,
            }}
          />
        </TouchableRipple>
      );
    },
    headerRight: () => {
      const navigation = useNavigation();
      return (
        <>
          <IconButton
            icon="cart-outline"
            iconColor="#fff"
            size={28}
            onPress={() => navigation.navigate("Cart")}
          />
          <IconButton
            icon="package-variant"
            iconColor="#fff"
            size={28}
            onPress={() => navigation.navigate("Orders")}
          />
          <IconButton
            icon="account-outline"
            iconColor="#fff"
            size={28}
            onPress={() => navigation.navigate("Profile", { user: "jane" })}
          />
        </>
      );
    },
  },
  screens: {
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
    Home: {
      screen: Home,
      options: {
        title: "Telas",
      },
    },

    Profile: {
      screen: Profile,
      options: ({ route }: { route: { params?: { user?: string } } }) => ({
        title: `Perfil: ${route.params?.user ?? ""}`,
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
        title: `Vendedor: {route.params.user}`,
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
    ProductInfo: {
      screen: ProductInfo,
      options: {
        title: "Detalhes do Produto",
      },
      linking: {
        path: "product/:id",
        parse: {
          id: (value) => String(value),
        },
      },
    },
    Cart: {
      screen: Cart,
      options: {
        title: "Carrinho",
      },
    },
    Orders: {
      screen: Orders,
      options: {
        title: "Meus Pedidos",
      },
    },
    Recipes: {
      screen: Recipes,
      options: {
        title: "Receitas",
        headerRight: () => {
          const navigation = useNavigation();
          return (
            <IconButton
              icon="heart-outline"
              iconColor="#fff"
              size={28}
              onPress={() => console.log("Favorite toggled")}
            />
          );
        },
      },
    },
    Checkout: {
      screen: Checkout,
      options: {
        title: "Finalizar Pedido",
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

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
