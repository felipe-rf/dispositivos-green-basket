import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Button, Text } from "@react-navigation/elements";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("admin@homyapp.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // Minimum 6 characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  const handleAuth = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Basic validation
    if (!email) {
      setEmailError("O e-mail é obrigatório"); // Translated
      return;
    }

    if (!password) {
      setPasswordError("A senha é obrigatória"); // Translated
      return;
    }

    // Email format validation
    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um endereço de e-mail válido"); // Translated
      return;
    }

    // Password validation (only for sign up)
    if (isSignUp && !validatePassword(password)) {
      setPasswordError(
        "A senha deve ter no mínimo 6 caracteres, com pelo menos uma letra e um número", // Translated
      );
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        console.log("Creating new user");
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Sucesso", "Conta criada com sucesso"); // Translated
        navigation.navigate("Home");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate("Home");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ocorreu um erro desconhecido"; // Translated

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setEmailError("E-mail já em uso"); // Translated
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Endereço de e-mail inválido"); // Translated
      } else if (error.code === "auth/weak-password") {
        setPasswordError("A senha deve ter no mínimo 6 caracteres"); // Translated
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential" // Added this common Firebase error code
      ) {
        setPasswordError("E-mail ou senha inválidos"); // Translated
      } else {
        Alert.alert("Erro de Autenticação", errorMessage); // Translated title
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Green Basket</Text>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="E-mail" // Translated
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Senha" // Translated
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          secureTextEntry
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <>
            <Button
              onPress={handleAuth}
              style={styles.authButton}
              children={isSignUp ? "Criar conta" : "Entrar"} // Translated
            />

            <Button
              onPress={() => {
                setIsSignUp(!isSignUp);
                setEmailError("");
                setPasswordError("");
              }}
              style={styles.switchButton}
              children={
                isSignUp
                  ? "Já tem uma conta? Entrar" // Translated
                  : "Não tem uma conta? Crie uma" // Translated
              }
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4CCE88",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: 40,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  authButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#840BCE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  switchButton: {
    marginTop: 20,
  },
});
