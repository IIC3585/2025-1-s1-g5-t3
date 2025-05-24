<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import BookModal from './BookModal.svelte';
  import BookCarousel from './BookCarousel.svelte';
  import { readBooks, recommendedBooks, wantToReadBooks } from '$lib/stores/bookLists';
  
  export let books: Array<{
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    key: string;
    publisher?: string[];
    language?: string[];
    subject?: string[];
    number_of_pages_median?: number;
  }> = [];

  let selectedBook: typeof books[0] | null = null;
  let isModalOpen = false;

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150x200?text=No+Image';
  }

  function handleBookClick(event: CustomEvent) {
    selectedBook = event.detail;
    isModalOpen = true;
  }

  function handleModalClose() {
    isModalOpen = false;
    selectedBook = null;
  }
</script>

<div class="results-container">
  {#if books.length === 0}
    <p class="no-results">No se encontraron resultados</p>
  {:else}
    <BookCarousel 
      books={books} 
      title="Resultados de búsqueda"
      on:bookClick={handleBookClick}
    />
  {/if}

  <div class="my-books-sections">
    {#if $readBooks.length > 0}
      <BookCarousel 
        books={$readBooks} 
        title="Mis libros leídos"
        on:bookClick={handleBookClick}
      />
    {/if}

    {#if $recommendedBooks.length > 0}
      <BookCarousel 
        books={$recommendedBooks} 
        title="Mis libros recomendados"
        on:bookClick={handleBookClick}
      />
    {/if}

    {#if $wantToReadBooks.length > 0}
      <BookCarousel 
        books={$wantToReadBooks} 
        title="Libros que quiero leer"
        on:bookClick={handleBookClick}
      />
    {/if}
  </div>
</div>

<BookModal 
  isOpen={isModalOpen} 
  book={selectedBook} 
  on:close={handleModalClose}
/>

<style>
  .results-container {
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Poppins', sans-serif;
  }

  .no-results {
    text-align: center;
    color: #5c4033;
    font-size: 1.1rem;
    margin-top: 2rem;
    font-family: 'Poppins', sans-serif;
  }

  .my-books-sections {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
  }

  .book-card {
    cursor: pointer;
    background: #ffffff;
    border: none;
    padding: 0;
    text-align: left;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    cursor: pointer;
  }

  .book-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .book-cover {
    width: 100%;
    height: 280px;
    background: #f5f0e6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-cover {
    color: #5c4033;
    font-size: 0.9rem;
    text-align: center;
    padding: 1rem;
    font-family: 'Poppins', sans-serif;
  }

  .book-info {
    padding: 1rem;
  }

  .book-title {
    font-size: 1rem;
    font-weight: 600;
    color: #5c4033;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-family: 'Poppins', sans-serif;
    letter-spacing: -0.3px;
  }

  .book-author {
    font-size: 0.9rem;
    color: #5c4033;
    opacity: 0.8;
    margin: 0 0 0.25rem 0;
    font-family: 'Poppins', sans-serif;
  }

  .book-year {
    font-size: 0.8rem;
    color: #5c4033;
    opacity: 0.6;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }

  @media (max-width: 768px) {
    .books-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .book-cover {
      height: 220px;
    }

    .book-title {
      font-size: 0.95rem;
    }

    .book-author {
      font-size: 0.85rem;
    }

    .book-year {
      font-size: 0.75rem;
    }
  }
</style> 