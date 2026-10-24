import { StyleSheet, Text, View } from 'react-native';
import { TYPE_COLORS, TYPE_NAMES } from '../utils/pokemonTypes';

export default function TypeBadge({ type }) {
  // Si llega un tipo que no está en la paleta, se usa un gris por defecto
  const color = TYPE_COLORS[type] || '#999999';

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{TYPE_NAMES[type] || type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});