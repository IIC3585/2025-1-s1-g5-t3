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
</style> 