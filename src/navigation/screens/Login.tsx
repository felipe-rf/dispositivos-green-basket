import React, {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, TextInput, View} from 'react-native';
import {Button, Text} from '@react-navigation/elements';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebaseConfig';
import {useNavigation} from '@react-navigation/native';

export function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert('Success', 'Account created successfully');
                // Navigate to HomeTabs after successful signup
                navigation.navigate('HomeTabs');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                // Navigate to HomeTabs after successful login
                navigation.navigate('HomeTabs');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            Alert.alert('Authentication Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Green Basket</Text>
            <Text style={styles.subtitle}>{isSignUp ? 'Create Account' : 'Login'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50"/>
            ) : (
                <>
                    <Button onPress={handleAuth} style={styles.authButton}>
                        <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
                    </Button>

                    <Button onPress={() => setIsSignUp(!isSignUp)} style={styles.switchButton}>
                        <Text style={styles.switchText}>
                            {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                        </Text>
                    </Button>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4CAF50',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    authButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 20,
    },
    switchText: {
        color: '#4CAF50',
        fontSize: 14,
    },
});
