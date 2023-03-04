import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import Map from './MapView';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        Alert.alert('Hello ' + userCredential.user.email);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        setLoggedIn(true);
        Alert.alert('Signed in');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setLoggedIn(false);
        Alert.alert('Signed out');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderMap = () => {
    return (
      <>
        <Map />
        <Button title="Sign Out" onPress={handleSignOut} />
      </>
    );
  };

  const renderLogin = () => {
    return (
      <>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />

        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} style={styles.input} />

        <Button title="Create Account" onPress={handleCreateAccount} />

        <Button title="Sign In" onPress={handleSignIn} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {loggedIn ? renderMap() : renderLogin()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
    width: 200,
  },
});

export default App;
