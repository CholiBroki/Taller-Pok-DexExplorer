import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { getPokemonDetail, getPokemonList } from '../services/pokeapi';
import { getArtworkUrl } from '../utils/pokemon';

const PAGE_SIZE = 20;

export default function PokemonListScreen({ onSelectPokemon }) {
  // Concepto: useState guarda los datos que, al cambiar, vuelven a dibujar la pantalla
  const [pokemons, setPokemons] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estado de la búsqueda
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  // Valores posibles: 'idle', 'loading', 'success', 'notFound', 'error'
  const [searchStatus, setSearchStatus] = useState('idle');

  // Concepto: useRef evita pedir dos páginas a la vez, porque
  // onEndReached puede dispararse varias veces seguidas
  const isLoadingRef = useRef(false);

  // Concepto: useRef también guarda el offset actual, porque a diferencia
  // de pokemons.length se actualiza al instante y no queda desactualizado
  const offsetRef = useRef(0);

  async function loadMore() {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    try {
      const result = await getPokemonList(PAGE_SIZE, offsetRef.current);
      offsetRef.current += PAGE_SIZE;
      setPokemons((previous) => [...previous, ...result.pokemons]);
      setHasMore(result.hasMore);
    } catch (error) {
      // Por ahora solo en consola; en la fase 6 se muestra en pantalla
      console.log('Error al cargar la lista:', error.message);
    } finally {
      isLoadingRef.current = false;
      setLoadingMore(false);
    }
  }

  // Concepto: el array vacío [] carga la primera página una sola vez
  useEffect(() => {
    loadMore();
  }, []);

  // La búsqueda solo se ejecuta al presionar el botón, no en cada letra
  async function handleSearch() {
    const cleanQuery = query.trim();

    // Campo vacío: se vuelve a la lista completa
    if (cleanQuery === '') {
      setSearchResult(null);
      setSearchStatus('idle');
      return;
    }

    setSearchStatus('loading');

    try {
      const detail = await getPokemonDetail(cleanQuery);
      setSearchResult({
        id: detail.id,
        name: detail.name,
        image: getArtworkUrl(detail.id),
      });
      setSearchStatus('success');
    } catch (error) {
      setSearchResult(null);
      setSearchStatus(error.message === 'NOT_FOUND' ? 'notFound' : 'error');
    }
  }

  // Contenido que se muestra debajo de la barra
  function renderContent() {
    if (searchStatus === 'loading') {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>Buscando Pokémon...</Text>
        </View>
      );
    }

    if (searchStatus === 'notFound') {
      return (
        <View style={styles.centered}>
          <Text style={styles.message}>
            No se encontró ningún Pokémon con ese nombre o número.
          </Text>
        </View>
      );
    }

    if (searchStatus === 'error') {
      return (
        <View style={styles.centered}>
          <Text style={styles.message}>
            Ocurrió un error al buscar. Intenta de nuevo.
          </Text>
        </View>
      );
    }

    if (searchStatus === 'success') {
      return (
        <View style={styles.resultContainer}>
          <PokemonCard pokemon={searchResult} onPress={onSelectPokemon} />
        </View>
      );
    }

    // Estado 'idle': la lista completa
    return (
      // Concepto: FlatList renderiza solo lo visible (mejor que ScrollView con map)
      <FlatList
        data={pokemons}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard pokemon={item} onPress={onSelectPokemon} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
      />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
  },
  resultContainer: {
    width: '50%',
    alignSelf: 'center',
    paddingTop: 8,
  },
});