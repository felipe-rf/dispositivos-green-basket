import React, { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native-paper";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from "firebase/firestore";
// Simple Rating component for displaying and selecting ratings
type RatingProps = {
  value: number;
  onChange?: (value: number) => void;
};

const Rating: React.FC<RatingProps> = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: "row" }}>
      {stars.map((star) => (
        <IconButton
          key={star}
          icon={star <= value ? "star" : "star-outline"}
          size={28}
          onPress={onChange ? () => onChange(star) : undefined}
          disabled={!onChange}
        />
      ))}
    </View>
  );
};

export function Orders() {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;

  useEffect(() => {
    const fetchOrders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return; // No user is logged in
    }

    // Query orders where userId matches the current user
    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const productsSnapshot = await getDocs(collection(db, "products"));

    const productsMap: Record<string, any> = {};
    productsSnapshot.forEach((doc) => {
      productsMap[doc.id] = doc.data();
    });

    const formattedOrders = await Promise.all(
      ordersSnapshot.docs.map(async (orderDoc) => {
        const order = orderDoc.data();
        const items = order.products.map((p: any) => {
          const productInfo = productsMap[p.id] || {};
          return {
            id: p.id,
            name: productInfo.name || "product",
            price: productInfo.price || 0,
            quantity: p.quantity,
            image: productInfo.image || "https://via.placeholder.com/200",
          };
        });

        const totalValue = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

        return {
          id: orderDoc.id,
          date: order.date.toDate().toLocaleDateString(),
          deliveryDate: order.deliveryDate || "N/A",
          value: totalValue,
          items,
          rated: !!order.rating,
          rating: order.rating || 0,
          status: order.status || "pending", // Add status if available
        };
      })
    );

    // Sort orders by date (newest first)
    const sortedOrders = formattedOrders.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setOrders(sortedOrders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
  } finally {
    setLoading(false);
  }
};

    fetchOrders();
  }, []);


const submitRating = async () => {
  if (currentOrderId && rating > 0) {
    try {
      await updateDoc(doc(db, "orders", currentOrderId), {
        avaliacao: rating,
      });
      setOrders(
        orders.map((order) =>
          order.id === currentOrderId ? { ...order, rated: true, rating } : order
        )
      );
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
    }
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

  const handleAccordionToggle = (orderId: string) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  const openRatingModal = (orderId: string) => {
    setCurrentOrderId(orderId);
    setRating(0);
    setRatingModalVisible(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
          {orders.length === 0 ? (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        Nenhum pedido encontrado.
      </Text>
    </View>
  ) : (
        orders.map((order) => (
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
                {order.items.map((item: {
                  id: string;
                  name: string;
                  price: number;
                  quantity: number;
                  image: string;
                }) => (
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
        )))}
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
