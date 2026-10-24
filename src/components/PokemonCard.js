import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { capitalize, formatPokemonNumber } from '../utils/pokemon';

export default function PokemonCard({ pokemon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)}>
      {/* Concepto: una Image remota necesita width y height explícitos */}
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  number: {
    marginTop: 8,
    fontSize: 12,
    color: '#888888',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});