// Concepto: arquitectura propia. Toda la lógica de red vive en esta carpeta
// (services), separada de los componentes, que solo se encargan de la interfaz.
import { extractIdFromUrl, getArtworkUrl } from '../utils/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Concepto: async/await con fetch para consumir una API REST
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  // Concepto: revisar response.ok antes de llamar response.json()
  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const data = await response.json();

  const pokemons = data.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return { id, name: item.name, image: getArtworkUrl(id) };
  });

  return { pokemons, hasMore: data.next !== null };
}

export async function getPokemonDetail(query) {
  const cleanQuery = String(query).trim().toLowerCase();

  if (cleanQuery === '') {
    throw new Error('NOT_FOUND');
  }

  const response = await fetch(`${BASE_URL}/pokemon/${cleanQuery}`);

  // Concepto: revisar response.ok (un nombre inexistente responde 404 con texto, no JSON)
  if (response.status === 404) {
    throw new Error('NOT_FOUND');
  }
  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((item) => item.type.name),
    stats: data.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
}