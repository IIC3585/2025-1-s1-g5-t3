export async function buscarLibros(query, filter = 'all') {
  let url = 'https://openlibrary.org/search.json?limit=10';

  if (filter === 'title') {
    url += `&title=${encodeURIComponent(query)}`;
  } else if (filter === 'author') {
    url += `&author=${encodeURIComponent(query)}`;
  } else {
    url += `&q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  return data.docs;
}

// Nueva función para buscar libros por tema/género
export async function buscarLibrosPorTema(tema, excludeKey = null, limit = 3) {
  const url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(tema)}&limit=${limit + 2}`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  // Filtrar resultados para excluir el libro original
  let resultados = data.docs.filter(book => book.key !== excludeKey);
  
  // Limitar a la cantidad solicitada
  return resultados.slice(0, limit);
}