import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import { getPokemonList } from '../services/pokeapi';

const PAGE_SIZE = 20;

export default function PokemonListScreen({ onSelectPokemon }) {
  const [pokemons, setPokemons] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);


  const isLoadingRef = useRef(false);

  async function loadMore() {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    try {
      const result = await getPokemonList(PAGE_SIZE, pokemons.length);
      setPokemons((previous) => [...previous, ...result.pokemons]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.log('Error al cargar la lista:', error.message);
    } finally {
      isLoadingRef.current = false;
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadMore();
  }, []);

  return (
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

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
});