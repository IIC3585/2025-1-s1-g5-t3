<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import BookCarousel from '$lib/components/BookCarousel.svelte';
  import BookModal from '$lib/components/BookModal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  let selectedBook: any = null;
  let isModalOpen = false;

  function handleBookClick(event: CustomEvent) {
    selectedBook = event.detail;
    isModalOpen = true;
  }

  function handleModalClose() {
    isModalOpen = false;
    selectedBook = null;
  }
</script>

<Navbar />

<main>
  <div class="my-books-container">
    <h1 class="page-title">Mis Libros Leídos</h1>
    
    {#if $readBooks.length === 0}
      <div class="empty-state">
        <div class="empty-state-icon">📚</div>
        <p class="empty-state-message">
          Aún no has agregado ningún libro a tu lista de leídos.
          ¡Comienza a explorar y agrega tus libros favoritos!
        </p>
      </div>
    {:else}
      <div class="books-section">
        <BookCarousel 
          books={$readBooks} 
          title="Todos mis libros leídos"
          on:bookClick={handleBookClick}
        />
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <h3 class="stat-title">Total de Libros</h3>
          <p class="stat-value">{$readBooks.length}</p>
        </div>

        {#if $readBooks.length > 0}
          <div class="stat-card">
            <h3 class="stat-title">Libros con Calificación</h3>
            <p class="stat-value">
              {$readBooks.filter(book => book.rating).length}
            </p>
          </div>

          <div class="stat-card">
            <h3 class="stat-title">Promedio de Calificación</h3>
            <p class="stat-value">
              {($readBooks
                .filter(book => book.rating)
                .reduce((acc, book) => acc + (book.rating || 0), 0) / 
                $readBooks.filter(book => book.rating).length
              ).toFixed(1)}
            </p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</main>

<BookModal 
  isOpen={isModalOpen} 
  book={selectedBook} 
  on:close={handleModalClose}
/>

<style>
  main {
    margin-top: 4rem;
    padding: 2rem;
  }

  .my-books-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 2.5rem;
    color: #5c4033;
    margin-bottom: 2rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: #f5f0e6;
    border-radius: 16px;
    margin: 2rem 0;
  }

  .empty-state-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .empty-state-message {
    color: #5c4033;
    font-size: 1.2rem;
    line-height: 1.6;
    font-family: 'Poppins', sans-serif;
    max-width: 600px;
    margin: 0 auto;
  }

  .books-section {
    margin-bottom: 3rem;
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
    padding: 2rem;
    background: #f5f0e6;
    border-radius: 16px;
  }

  .stat-card {
    text-align: center;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(92, 64, 51, 0.1);
  }

  .stat-title {
    color: #5c4033;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
  }

  .stat-value {
    color: #8d4a2c;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }

    .empty-state {
      padding: 3rem 1.5rem;
    }

    .empty-state-icon {
      font-size: 3rem;
    }

    .empty-state-message {
      font-size: 1.1rem;
    }

    .stats-section {
      grid-template-columns: 1fr;
      padding: 1.5rem;
      gap: 1rem;
    }

    .stat-card {
      padding: 1.25rem;
    }

    .stat-value {
      font-size: 1.75rem;
    }
  }
</style> 