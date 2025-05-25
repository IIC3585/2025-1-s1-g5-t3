<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import ProfileStats from '$lib/components/ProfileStats.svelte';

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
    
    <div class="profile-layout">
      <div class="stats-section">
        <ProfileStats />
      </div>
      
      <div class="navigation-section">
        <a href="/authors" class="nav-button">
          <span class="button-icon">👥</span>
          <span class="button-text">Autores</span>
        </a>
        
        <a href="/subjects" class="nav-button">
          <span class="button-icon">📚</span>
          <span class="button-text">Temas</span>
        </a>
        
        <a href="/my-books" class="nav-button">
          <span class="button-icon">📖</span>
          <span class="button-text">Mis libros</span>
        </a>
      </div>
    </div>
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

  .profile-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 2rem;
    align-items: start;
  }

  .navigation-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: 6rem;
  }

  .nav-button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #f5f0e6;
    border-radius: 12px;
    text-decoration: none;
    color: #5c4033;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 1px solid rgba(92, 64, 51, 0.1);
    box-shadow: 0 4px 12px rgba(92, 64, 51, 0.08);
  }

  .nav-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(92, 64, 51, 0.12);
    background: #ebe4d6;
  }

  .button-icon {
    font-size: 1.5rem;
  }

  .button-text {
    font-size: 1.1rem;
    font-family: 'Poppins', sans-serif;
  }

  @media (max-width: 1024px) {
    .profile-layout {
      grid-template-columns: 1fr;
    }

    .navigation-section {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .nav-button {
      flex: 1;
      min-width: 200px;
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .profile-container {
      padding-top: 4rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .navigation-section {
      flex-direction: column;
    }

    .nav-button {
      width: 100%;
    }
  }
</style> 