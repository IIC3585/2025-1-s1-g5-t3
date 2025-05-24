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