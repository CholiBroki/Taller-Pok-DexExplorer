import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// Concepto: SafeAreaView mantiene el contenido lejos del notch y las barras del sistema
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import PokemonListScreen from './src/screens/PokemonListScreen';

export default function App() {
  // Id del Pokémon elegido. Si es null, se está viendo la lista
  const [selectedId, setSelectedId] = useState(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.title}>PokéDex Explorer</Text>

        {/* La lista se oculta, no se destruye: así conserva el scroll
            y los Pokémon ya cargados al volver */}
        <View style={[styles.listWrapper, selectedId !== null && styles.hidden]}>
          <PokemonListScreen
            onSelectPokemon={(pokemon) => setSelectedId(pokemon.id)}
          />
        </View>

        {selectedId !== null && (
          <PokemonDetailScreen
            pokemonId={selectedId}
            onBack={() => setSelectedId(null)}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Concepto: StyleSheet agrupa los estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  listWrapper: { flex: 1 },
  hidden: { display: 'none' },
});