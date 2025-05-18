export async function buscarLibros(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
  const res = await fetch(url);
  const data = await res.json();
  return data.docs;
}