<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  let favoriteGenre = '';
  let favoriteAuthor = '';
  let totalBooks = 0;
  let isLoading = true;
  let bookDetails: { [key: string]: any } = {};

  async function fetchBookDetails(workId: string) {
    try {
      const response = await fetch(`https://openlibrary.org${workId}.json`);
      if (!response.ok) throw new Error('Failed to fetch book details');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching details for work ${workId}:`, error);
      return null;
    }
  }

  async function loadBookDetails(books: any[]) {
    const detailsPromises = books.map(async (book) => {
      if (!bookDetails[book.key]) {
        const details = await fetchBookDetails(book.key);
        if (details) {
          bookDetails[book.key] = details;
        }
      }
    });
    await Promise.all(detailsPromises);
  }

  function calculateFavoriteGenre(books: any[]) {
    const genreCount: { [key: string]: number } = {};
    
    books.forEach(book => {
      const details = bookDetails[book.key];
      console.log('details', details);
      if (details?.subjects) {
        // Tomamos los primeros 50 géneros de cada libro para evitar ruido
        details.subjects.slice(0, 50).forEach((subject: string) => {
          // Limpiamos el género para agrupar mejor
          const cleanGenre = subject.toLowerCase()
            .replace(/^fiction\s*/, '')
            .replace(/^novels\s*/, '')
            .replace(/^stories\s*/, '')
            .trim();
          
          if (cleanGenre) {
            genreCount[cleanGenre] = (genreCount[cleanGenre] || 0) + 1;
          }
        });
      }
    });

    // Encontramos el género más frecuente
    const sortedGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a);

    return sortedGenres.length > 0 ? sortedGenres[0][0] : 'No hay datos suficientes';
  }

  function calculateFavoriteAuthor(books: any[]) {
    const authorCount: { [key: string]: number } = {};
    
    books.forEach(book => {
      console.log('book', book);
      if (book.author_name) {
        authorCount[book.author_name] = (authorCount[book.author_name] || 0) + 1;
      }
    });

    const sortedAuthors = Object.entries(authorCount)
      .sort(([, a], [, b]) => b - a);

    return sortedAuthors.length > 0 ? sortedAuthors[0][0] : 'No hay datos suficientes';
  }

  $: if ($readBooks) {
    totalBooks = $readBooks.length;
    isLoading = true;
    loadBookDetails($readBooks).then(() => {
      favoriteGenre = calculateFavoriteGenre($readBooks);
      favoriteAuthor = calculateFavoriteAuthor($readBooks);
      isLoading = false;
    });
  }
</script>

<Navbar />

<main class="profile-container">
  <div class="profile-content">
    <h1>Mi Perfil de Lectura</h1>

    {#if isLoading}
      <div class="loading">Cargando estadísticas...</div>
    {:else}
      <div class="stats-container">
        <div class="stat-card">
          <h2>Libros Leídos</h2>
          <div class="stat-value">{totalBooks}</div>
          <p class="stat-description">
            {totalBooks === 0 
              ? 'Aún no has agregado libros a tu lista de leídos'
              : totalBooks === 1 
                ? '¡Has leído 1 libro!'
                : `¡Has leído ${totalBooks} libros!`}
          </p>
        </div>

        <div class="stat-card">
          <h2>Género Favorito</h2>
          <div class="stat-value genre">{favoriteGenre}</div>
          <p class="stat-description">
            {favoriteGenre === 'No hay datos suficientes'
              ? 'Agrega más libros para descubrir tu género favorito'
              : 'Basado en tus libros leídos'}
          </p>
        </div>

        <div class="stat-card">
          <h2>Autor Favorito</h2>
          <div class="stat-value author">{favoriteAuthor}</div>
          <p class="stat-description">
            {favoriteAuthor === 'No hay datos suficientes'
              ? 'Agrega más libros para descubrir tu autor favorito'
              : 'Basado en tus libros leídos'}
          </p>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  .profile-container {
    padding-top: 5rem;
    min-height: 100vh;
    background-color: #ffffff;
    font-family: 'Poppins', sans-serif;
  }

  .profile-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 2.5rem;
    color: #5c4033;
    margin-bottom: 3rem;
    text-align: center;
    font-weight: 600;
    position: relative;
    padding-bottom: 1rem;
    font-family: 'Poppins', sans-serif;
    letter-spacing: -0.5px;
  }

  h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #5c4033;
    border-radius: 2px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .stat-card {
    background: #f5f0e6;
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(92, 64, 51, 0.08);
    border: 1px solid rgba(92, 64, 51, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(92, 64, 51, 0.12);
  }

  .stat-card h2 {
    color: #5c4033;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    letter-spacing: -0.3px;
  }

  .stat-value {
    font-size: 3rem;
    font-weight: 700;
    color: #5c4033;
    margin: 1rem 0;
    line-height: 1;
    font-family: 'Poppins', sans-serif;
  }

  .stat-value.genre {
    font-size: 2rem;
    text-transform: capitalize;
  }

  .stat-value.author {
    font-size: 1.75rem;
    line-height: 1.2;
  }

  .stat-description {
    color: #5c4033;
    opacity: 0.8;
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
    font-family: 'Poppins', sans-serif;
  }

  .loading {
    text-align: center;
    color: #5c4033;
    font-size: 1.1rem;
    margin-top: 2rem;
    font-family: 'Poppins', sans-serif;
  }

  @media (max-width: 768px) {
    .profile-container {
      padding-top: 4rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-container {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
    }

    .stat-value.genre {
      font-size: 1.75rem;
    }

    .stat-value.author {
      font-size: 1.5rem;
    }
  }
</style> 