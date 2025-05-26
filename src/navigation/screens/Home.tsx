import { Button } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";

export function Home() {
  return (
    <View style={styles.container}>
      <Button screen="Profile" params={{ user: "jane" }}>
        Perfil usuário
      </Button>
      <Button screen="SellerProfile" params={{ user: "john" }}>
        Perfil vendedor
      </Button>
      {/*  faq*/}
      <Button screen="FAQ">FAQ</Button>
      {/*    Carrinho*/}
      <Button screen="Cart">Carrinho</Button>
      {/*  Catalogo*/}
      <Button screen="Catalog">Catálogo</Button>
      {/*    pedidos */}
      <Button screen="Orders">Pedidos</Button>
      {/*Receitas*/}
      <Button screen="Recipes">Receitas</Button>
      {/*    Finalizar Pedido */}
      <Button screen="Checkout">Finalizar Pedido</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
