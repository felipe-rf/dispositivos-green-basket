import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"; // Added updateDoc
import { db } from "../../firebaseConfig"; // Ensure this path is correct

// Define the Recipe type
type Recipe = {
  id: string;
  name: string;
  prepTime: number; // Assuming prepTime is stored as a number
  servings: number; // Assuming servings is stored as a number
  image: string;
  isFavorite: boolean;
  // Add other fields if needed, e.g., ingredients, instructions
};

// Function to fetch recipes from Firebase
const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const snapshot = await getDocs(collection(db, "recipes"));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? "Unnamed Recipe",
        prepTime: typeof data.prepTime === "number" ? data.prepTime : 0,
        servings: typeof data.servings === "number" ? data.servings : 0,
        image:
          data.image ?? "https://via.placeholder.com/200x300.png?text=No+Image", // Default image
        isFavorite: data.isFavorite ?? false, // Default to false if not present
      };
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return empty array on error
  }
};

// Optional: Function to update favorite status in Firebase
const updateRecipeFavoriteStatus = async (
  recipeId: string,
  newFavoriteStatus: boolean,
) => {
  try {
    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, {
      isFavorite: newFavoriteStatus,
    });
    console.log(
      `Recipe ${recipeId} favorite status updated to ${newFavoriteStatus}`,
    );
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
};

export function Recipes() {
  const theme = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true); // Optional loading state

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchAndSetRecipes = async () => {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data);
      setFilteredRecipes(data); // Initialize filtered recipes with all recipes
      setLoading(false);
    };

    fetchAndSetRecipes();
  }, []);

  // Update filtered recipes when search query or recipes list changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query),
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  // Function to handle search query changes
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Function to toggle favorite status
  const toggleFavorite = async (id: string) => {
    // Optimistic UI update
    const newRecipes = recipes.map((recipe) =>
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe,
    );
    setRecipes(newRecipes); // This will also trigger the useEffect for filteredRecipes

    // Persist to Firebase (optional)
    const recipeToUpdate = newRecipes.find((r) => r.id === id);
    if (recipeToUpdate) {
      // Comment out the line below if you don't want to persist to Firebase
      await updateRecipeFavoriteStatus(id, recipeToUpdate.isFavorite);
    }
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
      paddingTop: 16,
    },
    searchBarContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    searchBar: {
      borderRadius: 10,
      elevation: 0,
      backgroundColor: theme.colors.surfaceVariant, // Or theme.colors.elevation.level2
    },
    scrollViewContentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    recipeCard: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      overflow: "hidden", // Ensures image corners are also rounded if image is first child
    },
    recipeCardContent: {
      // Not directly used in layout, but good for consistency
      padding: 0,
    },
    recipeImage: {
      width: "100%",
      height: 180,
    },
    recipeInfoContainer: {
      padding: 16,
    },
    recipeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    recipeTitle: {
      fontSize: 18,
      fontWeight: "bold",
      flex: 1, // Allow title to take available space
      color: theme.colors.onSurface,
    },
    recipeMetaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    recipeMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    recipeMetaText: {
      marginLeft: 4,
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    loadingContainer: {
      // For loading indicator
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (loading) {
    return (
      <View style={[styles.pageContainer, styles.loadingContainer]}>
        <Text>Loading recipes...</Text>
        {/* You can use ActivityIndicator here from react-native or react-native-paper */}
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentBody}>
        <View style={styles.searchBarContainer}>
          <Searchbar
            placeholder="Buscar receitas"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.onSurfaceVariant}
            inputStyle={{ color: theme.colors.onSurface }}
            // placeholderTextColor={theme.colors.onSurfaceVariant} // Explicitly set placeholder color
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {filteredRecipes.length === 0 && !loading && (
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              No recipes found.
            </Text>
          )}
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} style={styles.recipeCard}>
              {/* Card.Cover can be an alternative for images if you want more control from Paper */}
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeInfoContainer}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {recipe.name}
                  </Text>
                  <IconButton
                    icon={recipe.isFavorite ? "heart" : "heart-outline"}
                    iconColor={
                      recipe.isFavorite
                        ? theme.colors.error // Or a custom favorite color
                        : theme.colors.onSurfaceVariant
                    }
                    size={24}
                    onPress={() => toggleFavorite(recipe.id)}
                  />
                </View>
                <View style={styles.recipeMetaContainer}>
                  <View style={styles.recipeMetaItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text style={styles.recipeMetaText}>
                      {recipe.prepTime} min
                    </Text>
                  </View>
                  <View style={styles.recipeMetaItem}>
                    <MaterialCommunityIcons
                      name="account-group-outline"
                      size={16}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text style={styles.recipeMetaText}>
                      {recipe.servings}{" "}
                      {recipe.servings !== 1 ? "porções" : "porção"}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
