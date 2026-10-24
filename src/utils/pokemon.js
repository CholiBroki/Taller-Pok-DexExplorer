export function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export function getArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokemonNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}