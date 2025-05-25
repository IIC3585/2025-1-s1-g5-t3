<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import { onMount } from 'svelte';

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
      if (details?.subjects) {
        details.subjects.slice(0, 50).forEach((subject: string) => {
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

    const sortedGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a);

    return sortedGenres.length > 0 ? sortedGenres[0][0] : 'No hay datos suficientes';
  }

  function calculateFavoriteAuthor(books: any[]) {
    const authorCount: { [key: string]: number } = {};
    
    books.forEach(book => {
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

<div class="profile-stats">
  {#if isLoading}
    <div class="loading">Cargando estadísticas...</div>
  {:else}
    <div class="stat-card">
      <div class="stat-item">
        <span class="stat-label">Libros Leídos:</span>
        <span class="stat-value">{totalBooks}</span>
        <p class="stat-description">
          {totalBooks === 0 
            ? 'Aún no has agregado libros a tu lista de leídos'
            : totalBooks === 1 
              ? '¡Has leído 1 libro!'
              : `¡Has leído ${totalBooks} libros!`}
        </p>
      </div>

      <div class="stat-item">
        <span class="stat-label">Género Favorito:</span>
        <span class="stat-value genre">{favoriteGenre}</span>
        <p class="stat-description">
          {favoriteGenre === 'No hay datos suficientes'
            ? 'Agrega más libros para descubrir tu género favorito'
            : 'Basado en tus libros leídos'}
        </p>
      </div>

      <div class="stat-item">
        <span class="stat-label">Autor Favorito:</span>
        <span class="stat-value author">{favoriteAuthor}</span>
        <p class="stat-description">
          {favoriteAuthor === 'No hay datos suficientes'
            ? 'Agrega más libros para descubrir tu autor favorito'
            : 'Basado en tus libros leídos'}
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-stats {
    width: 100%;
  }

  .stat-card {
    background: #f5f0e6;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(92, 64, 51, 0.08);
    border: 1px solid rgba(92, 64, 51, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(92, 64, 51, 0.12);
  }

  .stat-item {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(92, 64, 51, 0.1);
  }

  .stat-item:last-child {
    border-bottom: none;
  }

  .stat-label {
    color: #5c4033;
    font-size: 1.25rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    margin-right: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #5c4033;
    font-family: 'Poppins', sans-serif;
  }

  .stat-value.genre {
    text-transform: capitalize;
  }

  .stat-description {
    color: #5c4033;
    opacity: 0.8;
    font-size: 0.9rem;
    margin: 0.5rem 0 0 0;
    line-height: 1.4;
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
    .stat-card {
      padding: 1.5rem;
    }

    .stat-label {
      font-size: 1.1rem;
    }

    .stat-value {
      font-size: 1.3rem;
    }

    .stat-description {
      font-size: 0.85rem;
    }
  }
</style> 