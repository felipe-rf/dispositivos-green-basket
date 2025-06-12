import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, List, Text, useTheme } from "react-native-paper";
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface FaqItem {
  id: string;
  title: string;
  content: string;
}

export function FAQ() {
  const theme = useTheme();
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    async function carregarFAQ() {
      const querySnapshot = await getDocs(collection(db, "faq"));
      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title ?? "",
          content: data.content ?? ""
        };
      });
      setFaqItems(items);
    }

    carregarFAQ();
  }, []);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perguntas Frequentes</Text>
      <ScrollView>
        <Card style={styles.card}>
          {faqItems.map((item, index) => (
            <List.Accordion
              key={item.id || index}
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
