import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper"; // Mock cart data - in a real app, this would come from a state management solution
import { useCart } from "../../contexts/CartContext"; // ajuste o caminho conforme necessário
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Mock cart data - in a real app, this would come from a state management solution
export function Checkout() {
  const navigation = useNavigation();
  const theme = useTheme();
  const {clearCart} = useCart();
// ...
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

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

  const handleConfirmOrder = () => {
    // In a real app, this would send the order to a backend
    finalizeOrder();
    alert("Pedido confirmado com sucesso!");
    navigation.navigate("Orders");
  };

    const finalizeOrder = async () => {
    try {
      const order = {
        date: Timestamp.now(),
        products: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        rating: null,
      };

      await addDoc(collection(db, "orders"), order);
      clearCart(); // Limpar o carrinho após finalizar o pedido
      // Navegar para tela de pedidos ou mostrar confirmação
      navigation.navigate("Orders");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 80, // Space for the bottom button
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 16,
      marginBottom: 8,
    },
    card: {
      marginBottom: 16,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
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
    paymentMethodContainer: {
      marginBottom: 16,
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    addressInput: {
      marginBottom: 8,
    },
    addressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    addressHalfInput: {
      flex: 1,
      marginRight: 8,
    },
    addressHalfInputLast: {
      flex: 1,
    },
    confirmButton: {
      position: "absolute",
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Order Overview Section */}
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        <Card style={styles.card}>
          <Card.Content>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Avatar.Image
                  size={40}
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.price)} x {item.quantity}
                  </Text>
                </View>
                <Text>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
            <Divider style={{ marginVertical: 8 }} />
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
          </Card.Content>
        </Card>

        {/* Payment Method Section */}
        <Text style={styles.sectionTitle}>Método de Pagamento</Text>
        <Card style={styles.card}>
          <Card.Content>
            <RadioButton.Group
              onValueChange={(value) => setPaymentMethod(value)}
              value={paymentMethod}
            >
              <View style={styles.radioButton}>
                <RadioButton value="credit" />
                <Text>Cartão de Crédito</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="debit" />
                <Text>Cartão de Débito</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="pix" />
                <Text>PIX</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="boleto" />
                <Text>Boleto Bancário</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Rua"
              value={address.street}
              onChangeText={(text) => setAddress({ ...address, street: text })}
              style={styles.addressInput}
              mode="outlined"
            />
            <View style={styles.addressRow}>
              <TextInput
                label="Número"
                value={address.number}
                onChangeText={(text) =>
                  setAddress({ ...address, number: text })
                }
                style={styles.addressHalfInput}
                mode="outlined"
                keyboardType="numeric"
              />
              <TextInput
                label="Complemento"
                value={address.complement}
                onChangeText={(text) =>
                  setAddress({ ...address, complement: text })
                }
                style={styles.addressHalfInputLast}
                mode="outlined"
              />
            </View>
            <TextInput
              label="Bairro"
              value={address.neighborhood}
              onChangeText={(text) =>
                setAddress({ ...address, neighborhood: text })
              }
              style={styles.addressInput}
              mode="outlined"
            />
            <View style={styles.addressRow}>
              <TextInput
                label="Cidade"
                value={address.city}
                onChangeText={(text) => setAddress({ ...address, city: text })}
                style={styles.addressHalfInput}
                mode="outlined"
              />
              <TextInput
                label="Estado"
                value={address.state}
                onChangeText={(text) => setAddress({ ...address, state: text })}
                style={styles.addressHalfInputLast}
                mode="outlined"
              />
            </View>
            <TextInput
              label="CEP"
              value={address.zipCode}
              onChangeText={(text) => setAddress({ ...address, zipCode: text })}
              style={styles.addressInput}
              mode="outlined"
              keyboardType="numeric"
            />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Confirm Order Button */}
      <Button
        mode="contained"
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        Confirmar Pedido
      </Button>
    </View>
  );
}
