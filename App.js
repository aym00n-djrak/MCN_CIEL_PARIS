import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, GeoPoint, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const PARIS_REGION = {
  latitude: 48.864716,
  longitude: 2.349014,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function Map() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const destinationsRef = collection(db, "destinations");
  const [destinations, setDestinations] = useState([]);

  const getDestinations = () => {
    const destinationsRef = collection(db, "destinations");
    onSnapshot(destinationsRef, (snapshot) => {
      const destinationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDestinations(destinationList);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoggedIn(true);
        getDestinations();
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
        Alert.alert("Hello " + userCredential.user.email);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        setLoggedIn(true);
        getDestinations();
        Alert.alert("Signed in");
        setLoginModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setLoggedIn(false);
        Alert.alert("Signed out");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const mapRef = useRef(null);

  const handleAddLocation = async () => {
    try {
      const response = await Geocoder.from(address);
      const { lat, lng } = response.results[0].geometry.location;
      await addDoc(destinationsRef, {
        address,
        location: new GeoPoint(lat, lng),
        title,
        description,
        userId: auth.currentUser.uid,
      });
      console.log("Destination added to Firestore!");
      setModalVisible(false);
      setAddress("");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding destination to Firestore: ", error);
    }
  };

  const handlePressCenter = () => {
    mapRef.current.animateToRegion(PARIS_REGION, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{email}</Text>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={PARIS_REGION}
        region={PARIS_REGION}
        maxDelta={0.03}
      >
        {destinations.map((destination) => (
          <Marker
            key={destination.id}
            coordinate={{
              latitude: destination.location.latitude,
              longitude: destination.location.longitude,
            }}
            title={destination.title}
            description={destination.description}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCenter} onPress={handlePressCenter}>
        <Text style={styles.buttonText}>Center</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={() => setLoginModalVisible(true) && handleSignOut()}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddLocation}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={loginModalVisible}
      >
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 4,
  },
  buttonCenter: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 4,
  },
  buttonLogin: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 4,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 4,
    marginTop: 20,
  },
});
