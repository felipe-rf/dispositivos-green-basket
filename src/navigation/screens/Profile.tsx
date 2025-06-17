import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export function Profile() {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const theme = useTheme();
  const styles = StyleSheet.create({
    card: {
      padding: 0,
      width: "100%",
      borderRadius: 10,
      marginTop: 80,
    },
    container: {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      backgroundColor: theme.colors.secondaryContainer,
    },
    avatar: {
      marginTop: -70,
      alignSelf: "center",
    },
    menuItem: {
      flexDirection: "row", 
      alignItems: "center",
      paddingVertical: 12,
    },
  });

  const options = [
    {
      text: "Pedidos",
      icon: "clipboard-list",
      onPress: () => navigation.navigate("Orders"),
    },
    {
      text: "Receitas",
      icon: "book",
      onPress: () => navigation.navigate("Recipes"),
    },
    {
      text: "Endereços",
      icon: "map-marker",
    },
    {
      text: "Formas de Pagamento",
      icon: "credit-card",
    },
    {
      text: "FAQ",
      icon: "help-circle",
      onPress: () => navigation.navigate("FAQ"),
    },
    {
      text: "Sair",
      icon: "logout",
      onPress: () => {auth.signOut(); navigation.navigate("Login");},
    },
  ];

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Avatar.Image
          source={{ uri: "https://picsum.photos/200" }}
          size={120}
          style={styles.avatar}
        />
        <Card.Content style={{ padding: 0 }}>
          <Card.Title title={user?.email} subtitle={"Cliente"} />
          <Card style={{ marginTop: 20 }}>
            {options.map((option, index) => (
              <Card.Content
                key={index}
                style={styles.menuItem}
                onTouchEnd={option.onPress}
              >
                <Avatar.Icon icon={option.icon} size={24} />
                <Card.Title 
                  title={option.text} 
                  style={{ marginLeft: 10, width: '100%' }} 
                  titleStyle={{ width: '100%' }}
                />
              </Card.Content>
            ))}
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
}