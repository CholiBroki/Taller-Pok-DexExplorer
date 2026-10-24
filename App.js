import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';
// Concepto: SafeAreaView mantiene el contenido lejos del notch y las barras del sistema
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonListScreen from './src/screens/PokemonListScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.title}>PokéDex Explorer</Text>
        <PokemonListScreen onSelectPokemon={(pokemon) => console.log(pokemon)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Concepto: StyleSheet agrupa los estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
});