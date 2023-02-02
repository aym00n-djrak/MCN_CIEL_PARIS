import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Button, StyleSheet } from 'react-native';

const App = () => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 48.856614,
    longitude: 2.352222,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const onZoomToParis = () => {
    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        region={region}
        style={styles.map}
      >
        <Marker coordinate={region} />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Zoom to Paris" onPress={onZoomToParis} />
      </View>
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
  map: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default App;
