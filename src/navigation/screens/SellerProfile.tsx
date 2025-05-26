import { StaticScreenProps } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";
import { Text } from "@react-navigation/elements";

type Props = StaticScreenProps<{
  user: string;
}>;

export function SellerProfile({ route }: Props) {
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
      backgroundColor: theme.colors.secondary,
    },
    avatar: {
      marginTop: -70,
      alignSelf: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Avatar.Image
          source={{ uri: "https://picsum.photos/200" }}
          size={120}
          style={styles.avatar}
        />
        <Card.Content style={{ padding: 0 }}>
          <Card.Title title={"Maria Vendedora"} subtitle={"Vendedor"} />
          <Card style={{ marginTop: 20 }}>
            <Card.Content
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {/*  BIOGRAFIA */}
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Biografia
              </Text>
              <Text>
                Sou uma vendedora de produtos orgânicos, apaixonada por oferecer
                alimentos saudáveis e sustentáveis. Acredito que a alimentação
                orgânica é essencial para o bem-estar e a saúde de todos. Meu
                compromisso é fornecer produtos frescos, livres de agrotóxicos e
                cultivados de forma responsável. Estou aqui para ajudar você a
                fazer escolhas conscientes e saudáveis para sua família. Vamos
                juntos promover um estilo de vida mais saudável e sustentável!
              </Text>
              {/*  localizacao*/}
              <View
                style={{
                  marginTop: 20,
                  display: "flex",
                  flexDirection: "row",
                  // fill height
                  justifyContent: "space-around",
                  width: "100%",
                  gap: 20,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Localização
                    <Avatar.Icon
                      icon="map-marker"
                      size={24}
                      style={{ marginLeft: 10 }}
                    />
                  </Text>
                  <Card.Cover
                    source={{
                      uri: "https://picsum.photos/600",
                    }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  />
                </View>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    Produtos
                    <Avatar.Icon
                      icon="leaf"
                      size={24}
                      style={{ marginLeft: 10 }}
                    />
                  </Text>
                  <Card
                    style={{
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <Card.Cover
                      style={{
                        borderBottomStartRadius: 0,
                        borderBottomEndRadius: 0,
                      }}
                      source={{
                        uri: "https://picsum.photos/700",
                      }}
                    />
                    <Card.Actions>
                      <Text>16 produtos</Text>
                    </Card.Actions>
                  </Card>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
}
