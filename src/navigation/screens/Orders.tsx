import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Text,
  useTheme,
  Portal,
  Modal,
  IconButton,
} from "react-native-paper";

// Custom Rating component
interface RatingProps {
  value: number;
  maxStars?: number;
  size?: number;
  onChange?: (rating: number) => void;
}

const Rating = ({ value, maxStars = 5, size = 24, onChange }: RatingProps) => {
  const theme = useTheme();

  const handlePress = (rating: number) => {
    if (onChange) {
      onChange(rating);
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(starIndex)}
            disabled={!onChange}
          >
            <IconButton
              icon={starIndex <= value ? "star" : "star-outline"}
              iconColor={starIndex <= value ? "#FFD700" : theme.colors.onSurfaceVariant}
              size={size}
              style={{ margin: -4 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Mock orders data - in a real app, this would come from an API or state management
const ordersData = [
  {
    id: "1001",
    date: "15/05/2023",
    deliveryDate: "20/05/2023",
    value: 56.30,
    status: "Entregue",
    items: [
      {
        id: "p1",
        name: "Produto 1",
        price: 18.90,
        quantity: 2,
        image: "https://picsum.photos/seed/green/200/300",
      },
      {
        id: "p2",
        name: "Produto 2",
        price: 18.50,
        quantity: 1,
        image: "https://picsum.photos/seed/basket/200/300",
      }
    ],
    rated: false,
  },
  {
    id: "1002",
    date: "10/05/2023",
    deliveryDate: "15/05/2023",
    value: 37.25,
    status: "Entregue",
    items: [
      {
        id: "p3",
        name: "Produto 3",
        price: 12.75,
        quantity: 1,
        image: "https://picsum.photos/seed/2025/200/300",
      },
      {
        id: "p4",
        name: "Produto 4",
        price: 24.50,
        quantity: 1,
        image: "https://picsum.photos/seed/ayy/200/300",
      }
    ],
    rated: true,
    rating: 4,
  },
  {
    id: "1003",
    date: "05/05/2023",
    deliveryDate: "10/05/2023",
    value: 75.80,
    status: "Entregue",
    items: [
      {
        id: "p5",
        name: "Produto 5",
        price: 25.30,
        quantity: 3,
        image: "https://picsum.photos/seed/lmao/200/300",
      }
    ],
    rated: true,
    rating: 5,
  }
];

export function Orders() {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [orders, setOrders] = useState(ordersData);

  // Format currency
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const handleAccordionToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openRatingModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setRating(0);
    setRatingModalVisible(true);
  };

  const submitRating = () => {
    if (currentOrderId && rating > 0) {
      setOrders(
        orders.map((order) =>
          order.id === currentOrderId
            ? { ...order, rated: true, rating }
            : order
        )
      );
      setRatingModalVisible(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 16,
      paddingBottom: 24,
    },
    orderCard: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    orderImage: {
      marginRight: 16,
    },
    orderDetails: {
      flex: 1,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 4,
    },
    orderDate: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 2,
    },
    orderValue: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    accordionContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
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
      fontSize: 14,
      fontWeight: "bold",
    },
    itemPrice: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
    },
    itemQuantity: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
    },
    totalText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    rateButton: {
      marginTop: 12,
    },
    ratedContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    ratedText: {
      marginRight: 8,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
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
      textAlign: "center",
    },
    ratingContainer: {
      alignItems: "center",
      marginVertical: 16,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {orders.map((order) => (
          <Card key={order.id} style={styles.orderCard}>
            <Card.Content>
              <View style={styles.cardContent}>
                <Avatar.Image
                  size={60}
                  source={{ uri: order.items[0].image }}
                  style={styles.orderImage}
                />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderTitle}>Pedido #{order.id}</Text>
                  <Text style={styles.orderDate}>Data: {order.date}</Text>
                  <Text style={styles.orderDate}>Entrega: {order.deliveryDate}</Text>
                  <Text style={styles.orderValue}>{formatCurrency(order.value)}</Text>
                </View>
              </View>
            </Card.Content>

            <List.Accordion
              title="Detalhes do pedido"
              expanded={expandedId === order.id}
              onPress={() => handleAccordionToggle(order.id)}
            >
              <View style={styles.accordionContent}>
                {order.items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Avatar.Image
                      size={40}
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                    </View>
                    <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
                  </View>
                ))}
                <Divider />
                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalText}>{formatCurrency(order.value)}</Text>
                </View>

                {order.rated ? (
                  <View style={styles.ratedContainer}>
                    <Text style={styles.ratedText}>Sua avaliação:</Text>
                    <Rating value={order.rating} />
                  </View>
                ) : (
                  <Button
                    mode="contained"
                    style={styles.rateButton}
                    onPress={() => openRatingModal(order.id)}
                  >
                    Avaliar pedido
                  </Button>
                )}
              </View>
            </List.Accordion>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={ratingModalVisible}
          onDismiss={() => setRatingModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Avalie seu pedido</Text>
          <View style={styles.ratingContainer}>
            <Rating value={rating} onChange={setRating} />
          </View>
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setRatingModalVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={submitRating}
              disabled={rating === 0}
            >
              Enviar avaliação
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
