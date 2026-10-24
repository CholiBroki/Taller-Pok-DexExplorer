import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import StatBar from '../components/StatBar';
import TypeBadge from '../components/TypeBadge';
import { getPokemonDetail } from '../services/pokeapi';
import { capitalize, formatPokemonNumber } from '../utils/pokemon';

export default function PokemonDetailScreen({ pokemonId, onBack }) {
  const [detail, setDetail] = useState(null);
  // Valores posibles: 'loading', 'success', 'error'
  const [status, setStatus] = useState('loading');

  async function loadDetail() {
    setStatus('loading');

    try {
      const result = await getPokemonDetail(pokemonId);
      setDetail(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  // Concepto: el array [pokemonId] hace que la petición se repita solo
  // cuando cambia el Pokémon elegido, y no en cada redibujado
  useEffect(() => {
    loadDetail();
  }, [pokemonId]);

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Cargando ficha del Pokémon...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          No se pudo cargar la ficha. Revisa tu conexión e intenta de nuevo.
        </Text>
        <Button title="Reintentar" onPress={loadDetail} />
        <View style={styles.spacer} />
        <Button title="Volver a la lista" onPress={onBack} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Concepto: una Image remota necesita width y height explícitos */}
      <Image source={{ uri: detail.image }} style={styles.image} />

      <Text style={styles.number}>{formatPokemonNumber(detail.id)}</Text>
      <Text style={styles.name}>{capitalize(detail.name)}</Text>

      <View style={styles.types}>
        {detail.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </View>

      <View style={styles.measures}>
        <View style={styles.measure}>
          <Text style={styles.measureValue}>{detail.height} m</Text>
          <Text style={styles.measureLabel}>Altura</Text>
        </View>
        <View style={styles.measure}>
          <Text style={styles.measureValue}>{detail.weight} kg</Text>
          <Text style={styles.measureLabel}>Peso</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Text style={styles.sectionTitle}>Estadísticas base</Text>
        {detail.stats.map((stat) => (
          <StatBar key={stat.name} name={stat.name} value={stat.value} />
        ))}
      </View>

      <Button title="Volver a la lista" onPress={onBack} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
  },
  spacer: {
    height: 8,
  },
  image: {
    width: 240,
    height: 240,
  },
  number: {
    fontSize: 14,
    color: '#888888',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  types: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  measures: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  measure: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  measureValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  measureLabel: {
    fontSize: 13,
    color: '#888888',
  },
  stats: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});