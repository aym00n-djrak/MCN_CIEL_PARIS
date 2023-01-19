import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import paris from "./assets/paris.png";


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Sous le ciel Paris!</Text>
      <Image
        source={paris}
        style={{
          width: 200,
          height: 200,
          marginTop: 20,
          marginBottom: 200,
          alignSelf: "center",
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
