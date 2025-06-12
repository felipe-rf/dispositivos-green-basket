import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext"; // Adjust path if necessary
import { Button } from "react-native-paper"; // Using react-native-paper button

import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB, Text, useTheme } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "",
      price: data.price ?? "",
      image: data.image ?? "",
      category: data.category ?? "", // ex: "cat1"
      // Add other fields if needed
    };
  });
};
type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string; // ex: "cat1"
  // Add other fields if needed
};

export function Catalog() {
  
  const theme = useTheme();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<
  { id: string; name: string; products: Product[] }[]
>([]);

useEffect(() => {
  (async () => {
    const data = await getProducts();
    const grouped = groupByCategory(data);
    setCategories(Object.values(grouped));
  })();
}, []);

// Função para agrupar produtos por categoria
  const groupByCategory = (items: Product[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { id: item.category, name: item.category, products: [] };
      }
      acc[item.category].products.push(item);
      return acc;
    }, {} as { [key: string]: { id: string; name: string; products: Product[] } });
  };


  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: theme.colors.secondaryContainer,
    },

    contentBody: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
    },
    scrollViewContentContainer: {
      paddingTop: 10, // Space above first category card
      paddingBottom: 80, // Ensure FAB doesn't overlap last item too much
    },
    categorySection: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
      borderRadius: 10,
      elevation: 2, // Subtle shadow for the category card
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 3,
    },
    categoryTitleText: {
      color: theme.colors.onSurface,
      fontSize: 19,
      fontWeight: "bold",
      marginBottom: 16,
    },
    productsHorizontalScrollView: {
      // Optional: padding for the horizontal scroll view's content
    },
    productItemCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      width: 115,
      marginRight: 12, // Spacing between product cards
      elevation: 0, // Product cards are flat within the category section
      borderWidth: 0.5,
      borderColor: theme.colors.outlineVariant, // Subtle border
    },
    productItemContent: {
      // Container for padding within the product card
      padding: 8,
      alignItems: "center", // Center image and text
    },
    productItemImage: {
      width: 90,
      height: 80,
      borderRadius: 6,
      marginBottom: 10,
    },
    productItemName: {
      color: theme.colors.onSurface,
      fontSize: 13,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 3,
    },
    productItemPrice: {
      fontSize: 12,
      textAlign: "center",
    },
    fab: {
      position: "absolute",
      margin: 20,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary, // FAB background color
    },
    addToCartButton: {
      marginTop: 6,
      width: "100%",
      paddingVertical: 2,
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentBody}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {products.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <Text style={styles.categoryTitleText}>{category.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsHorizontalScrollView}
              >
                {category.products.map((product) => (
                  <Card
                    key={product.id}
                    style={styles.productItemCard}
                    elevation={styles.productItemCard.elevation}
                  >
                    <View style={styles.productItemContent}>
                      <Image
                        source={{ uri: product.image }}
                        style={styles.productItemImage}
                      />
                      <Text style={styles.productItemName}>{product.name}</Text>
                      <Text style={styles.productItemPrice}>
                        {product.price}
                      </Text>
                      <Button
                        mode="contained"
                        onPress={() => {
                          const numericPrice = parseFloat(
                            product.price
                              .replace(/[^\d.,]/g, "")
                              .replace(",", ".")
                          );
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: numericPrice,
                            image: product.image,
                            quantity: 1,
                          });
                        }}
                        style={styles.addToCartButton}
                        compact
                      >
                        Add to Cart
                      </Button>
                    </View>
                  </Card>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>

      <FAB
        style={styles.fab}
        icon="filter-variant"
        color={theme.colors.onPrimary} // Icon color is white
        onPress={() => console.log("FAB pressed")}
      />
    </View>
  );
}
