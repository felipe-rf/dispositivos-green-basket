import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useCart } from "../../contexts/CartContext"; // Adjust path as needed
import { useNavigation } from "@react-navigation/native";
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string; // Optional field
};

export function ProductInfo({ route }: any) {
  const theme = useTheme();
  const  productId = route.params.id; // Pass productId via navigation
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart(); // Cart context function
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Route params:", route.params);
        console.log("Product ID recebido:", productId);
        const productRef = doc(db, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const priceString = String(product.price);
      const numericPrice = parseFloat(
        priceString.replace(/[^\d.,]/g, "").replace(",", ".")
      );
      addItem({
        id: product.id,
        name: product.name,
        price: numericPrice,
        image: product.image,
        quantity: 1,
      });1
      navigation.navigate("Cart"); 
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="titleMedium">Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Product Image */}
      <Card style={styles.card}>
        <Card.Cover
          source={{ uri: product.image.replace("/https:", "https:") }} // Fix URL if needed
          style={styles.image}
        />
      </Card>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text variant="headlineMedium" style={styles.name}>
          {product.name}
        </Text>

        <Text variant="titleLarge" style={styles.price}>
          R$ {product.price.toFixed(2).replace(".", ",")}
        </Text>

        <Text variant="bodyMedium" style={styles.category}>
          Categoria: {product.category}
        </Text>

        {product.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {product.description}
          </Text>
        )}

        {/* Add to Cart Button */}
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          icon="cart"
        >
          Adicionar ao Carrinho
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    paddingHorizontal: 8,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  price: {
    fontWeight: "bold",
    color: "#2e7d32", // Green color for price
    marginBottom: 12,
  },
  category: {
    color: "#666",
    marginBottom: 16,
  },
  description: {
    color: "#444",
    marginBottom: 20,
    lineHeight: 22,
  },
  addToCartButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});
