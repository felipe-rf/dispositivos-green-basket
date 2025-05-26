import { ScrollView, StyleSheet, View } from "react-native";
import { Card, List, Text, useTheme } from "react-native-paper";

export function FAQ() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: theme.colors.primary,
      textAlign: "center",
    },
    card: {
      marginBottom: 16,
    },
    accordionTitle: {
      color: theme.colors.primary,
    },
    accordionContent: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
  });

  // FAQ data
  const faqItems = [
    {
      title: "O que é o Green Basket?",
      content:
        "Green Basket é um aplicativo que conecta consumidores a produtores locais de alimentos orgânicos e sustentáveis, facilitando a compra direta de produtos frescos e apoiando a agricultura local.",
    },
    {
      title: "Como faço para me cadastrar?",
      content:
        "Para se cadastrar, basta clicar no botão 'Criar conta' na tela de login e preencher o formulário com seus dados pessoais. Após a confirmação do e-mail, você já pode começar a usar o aplicativo.",
    },
    {
      title: "Quais formas de pagamento são aceitas?",
      content:
        "Aceitamos pagamentos via cartão de crédito, débito, PIX e transferência bancária. Todas as transações são seguras e protegidas.",
    },
    {
      title: "Como funciona a entrega?",
      content:
        "As entregas são realizadas pelos próprios produtores ou por nossa rede de entregadores parceiros. O prazo de entrega varia de acordo com a sua localização e a disponibilidade do produtor, geralmente entre 1 e 3 dias úteis.",
    },
    {
      title: "Posso cancelar meu pedido?",
      content:
        "Sim, você pode cancelar seu pedido até 24 horas após a confirmação. Após esse período, entre em contato com o suporte para verificar a possibilidade de cancelamento.",
    },
    {
      title: "Como sei que os produtos são realmente orgânicos?",
      content:
        "Todos os produtores parceiros do Green Basket passam por um processo de verificação e devem apresentar certificações de produção orgânica. Além disso, realizamos visitas periódicas às propriedades para garantir a qualidade dos produtos.",
    },
    {
      title: "O que fazer se receber um produto danificado?",
      content:
        "Se você receber um produto danificado ou em condições inadequadas, tire uma foto e entre em contato com nosso suporte em até 24 horas após o recebimento. Faremos o reembolso ou a substituição do produto.",
    },
    {
      title: "Como posso me tornar um vendedor no Green Basket?",
      content:
        "Para se tornar um vendedor, acesse a opção 'Seja um Produtor' no menu do aplicativo e preencha o formulário de cadastro. Nossa equipe entrará em contato para verificar suas informações e finalizar o processo.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perguntas Frequentes</Text>
      <ScrollView>
        <Card style={styles.card}>
          {faqItems.map((item, index) => (
            <List.Accordion
              key={index}
              title={item.title}
              titleStyle={styles.accordionTitle}
              id={`faq-${index}`}
            >
              <View style={styles.accordionContent}>
                <Text>{item.content}</Text>
              </View>
            </List.Accordion>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}
