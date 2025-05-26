import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper"; // Mock cart data - in a real app, this would come from a state management solution

// Mock cart data - in a real app, this would come from a state management solution
const initialCartItems = [
  {
    id: "p1",
    name: "Produto 1",
    price: 18.9,
    quantity: 2,
    image: "https://picsum.photos/seed/green/200/300",
  },
  {
    id: "p2",
    name: "Produto 2",
    price: 24.5,
    quantity: 1,
    image: "https://picsum.photos/seed/basket/200/300",
  },
  {
    id: "p3",
    name: "Produto 3",
    price: 12.75,
    quantity: 3,
    image: "https://picsum.photos/seed/2025/200/300",
  },
];

export function Cart() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Functions to handle quantity changes
  const incrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrementQuantity = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 10.0; // Fixed shipping cost for this example
  const total = subtotal + shippingCost;

  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 120, // Space for the bottom sheet
    },
    cartItemCard: {
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // Added to space out image/details and quantity controls
    },
    itemImage: {
      marginRight: 12,
    },
    itemDetails: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    itemPrice: {
      fontSize: 14,
      color: theme.colors.primary,
    },
    itemQuantity: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    quantityControlContainer: {
      marginLeft: "auto", // Push to the right
      flexDirection: "row",
      alignItems: "center",
      // Removed marginTop: 8 as it's now in the same row
      backgroundColor: theme.colors.secondary, // Added background color
      borderRadius: 8,
    },

    quantityText: {
      fontSize: 16,
      marginHorizontal: 8,
      fontWeight: "bold",
    },
    quantityButton: {
      margin: 0,
    },
    emptyCartContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyCartText: {
      fontSize: 18,
      color: theme.colors.onSurfaceVariant,
      marginTop: 16,
    },
    bottomSheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      marginBottom: 16,
    },
    totalText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    confirmButton: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      margin: 20,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
    },
    modalButton: {
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {cartItems.map((item) => (
            <Card key={item.id} style={styles.cartItemCard}>
              <Card.Content>
                <View style={styles.itemRow}>
                  <Avatar.Image
                    size={50}
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                  </View>
                  <View style={styles.quantityControlContainer}>
                    <IconButton
                      icon="minus"
                      size={20}
                      style={styles.quantityButton}
                      onPress={() => decrementQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    />
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      style={styles.quantityButton}
                      onPress={() => incrementQuantity(item.id)}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Avatar.Icon
            size={80}
            icon="cart-outline"
            color={theme.colors.primary}
          />
          <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
        </View>
      )}

      {/* Bottom sheet with cart summary */}
      {cartItems.length > 0 && (
        <View style={styles.bottomSheet}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Frete</Text>
            <Text>{formatCurrency(shippingCost)}</Text>
          </View>
          <Divider />
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>{formatCurrency(total)}</Text>
          </View>
          <Button
            mode="contained"
            style={styles.confirmButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            Finalizar compra
          </Button>
        </View>
      )}

      {/* Order confirmation modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Pedido Confirmado!</Text>
          <Text>Seu pedido foi realizado com sucesso.</Text>
          <Text>Total: {formatCurrency(total)}</Text>
          <Button
            mode="contained"
            style={styles.modalButton}
            onPress={hideModal}
          >
            Fechar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}
