import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Sample recipe data

// Sample recipe data
const recipesData = [
  {
    id: "recipe1",
    name: "Salada Verde com Grãos",
    prepTime: 15, // in minutes
    servings: 2,
    image: "https://picsum.photos/seed/salad1/200/300",
    isFavorite: false,
  },
  {
    id: "recipe2",
    name: "Smoothie de Frutas Vermelhas",
    prepTime: 5, // in minutes
    servings: 1,
    image: "https://picsum.photos/seed/smoothie/200/300",
    isFavorite: true,
  },
  {
    id: "recipe3",
    name: "Wrap de Legumes",
    prepTime: 20, // in minutes
    servings: 2,
    image: "https://picsum.photos/seed/wrap/200/300",
    isFavorite: false,
  },
  {
    id: "recipe4",
    name: "Bowl de Quinoa",
    prepTime: 25, // in minutes
    servings: 2,
    image: "https://picsum.photos/seed/quinoa/200/300",
    isFavorite: false,
  },
  {
    id: "recipe5",
    name: "Sopa de Legumes",
    prepTime: 30, // in minutes
    servings: 4,
    image: "https://picsum.photos/seed/soup/200/300",
    isFavorite: false,
  },
  {
    id: "recipe6",
    name: "Salada de Frutas",
    prepTime: 10, // in minutes
    servings: 2,
    image: "https://picsum.photos/seed/fruitsalad/200/300",
    isFavorite: false,
  },
];

export function Recipes() {
  const theme = useTheme();
  const [recipes, setRecipes] = useState(recipesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipesData);

  // Update filtered recipes when search query changes
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
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  // Function to toggle favorite status
  const toggleFavorite = (id) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe,
      ),
    );
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
      backgroundColor: theme.colors.surfaceVariant,
    },
    scrollViewContentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    recipeCard: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      overflow: "hidden",
    },
    recipeCardContent: {
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
      flex: 1,
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
  });

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
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} style={styles.recipeCard}>
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeInfoContainer}>
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeTitle}>{recipe.name}</Text>
                  <IconButton
                    icon={recipe.isFavorite ? "heart" : "heart-outline"}
                    iconColor={
                      recipe.isFavorite
                        ? theme.colors.error
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
                      {recipe.servings > 1 ? "porções" : "porção"}
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
