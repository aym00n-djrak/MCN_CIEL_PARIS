import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";

const PARIS_REGION = {
  latitude: 48.864716,
  longitude: 2.349014,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function Map() {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Configure l'API Google Maps Geocoding avec votre clé API
  Geocoder.init("AIzaSyCbZzW2ahika3m40ChIWqtd89nujDX-nqA");

  const handleAddLocation = () => {
    // Convertit l'adresse en coordonnées géographiques
    Geocoder.from(address)
      .then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        // Ajoute un nouveau marqueur à la liste des marqueurs
        setMarkers([
          ...markers,
          { latlng: { latitude: lat, longitude: lng }, title, description },
        ]);
        // Ferme la modal
        setModalVisible(false);
        // Réinitialise les champs de saisie
        setAddress("");
        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const handlePressCenter = () => {
    mapRef.current.animateToRegion(PARIS_REGION, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={PARIS_REGION}
        region={PARIS_REGION}
        maxDelta={0.03}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.title}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
