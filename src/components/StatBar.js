import { StyleSheet, Text, View } from 'react-native';
import { STAT_NAMES } from '../utils/pokemonTypes';

// El valor máximo posible de una estadística base es 255
const MAX_STAT = 255;

export default function StatBar({ name, value }) {
  // Concepto: el ancho de la barra es proporcional al valor
  const widthPercent = `${(value / MAX_STAT) * 100}%`;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{STAT_NAMES[name] || name}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: widthPercent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    width: 100,
    fontSize: 14,
    color: '#444444',
  },
  value: {
    width: 36,
    fontSize: 14,
    fontWeight: 'bold',
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
});