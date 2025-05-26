import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";

type Props = StaticScreenProps<{
  user: string;
}>;

export function Profile({ route }: Props) {
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
  });

  const options = [
    {
      text: "Minhas Informações",
      icon: "account",
    },
    {
      text: "Pedidos",
      icon: "clipboard-list",
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
    },
    {
      text: "Sair",
      icon: "logout",
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
          <Card.Title title={"José Pereira"} subtitle={"Cliente"} />
          <Card style={{ marginTop: 20 }}>
            {options.map((option, index) => (
              <Card.Content
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Avatar.Icon icon={option.icon} size={24} />
                <Card.Title title={option.text} style={{ marginLeft: 10 }} />
              </Card.Content>
            ))}
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
}
