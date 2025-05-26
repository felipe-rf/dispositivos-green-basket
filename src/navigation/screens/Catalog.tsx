import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Card, FAB, Text, useTheme } from "react-native-paper";

const categoriesData = [
  {
    id: "cat1",
    name: "Categoria",
    products: [
      {
        id: "p1",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/green/200/300",
      },
      {
        id: "p2",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/basket/200/300",
      },
      {
        id: "p3",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/2025/200/300",
      },
      {
        id: "p4",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/ayy/200/300",
      },
    ],
  },
  {
    id: "cat2",
    name: "Categoria",
    products: [
      {
        id: "p5",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/lmao/200/300",
      },
      {
        id: "p6",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/new/200/300",
      },
      {
        id: "p7",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/prod/200/300",
      },
    ],
  },
  {
    id: "cat3",
    name: "Categoria",
    products: [
      {
        id: "p8",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/cat3/200/300",
      },
      {
        id: "p9",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/v2/200/300",
      },
      {
        id: "p10",
        name: "Produto",
        price: "R$ 18,90",
        image: "https://picsum.photos/seed/blz/200/300",
      },
    ],
  },
];

export function Catalog() {
  const theme = useTheme();
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
  });

  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentBody}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {categoriesData.map((category) => (
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
