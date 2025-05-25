<script lang="ts">
  import { readBooks, recommendedBooks, wantToReadBooks } from '$lib/stores/bookLists';
  import AuthorBooks from '$lib/components/AuthorBooks.svelte';
  import BookModal from '$lib/components/BookModal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';

  let selectedBook: any = null;
  let isModalOpen = false;

  $: allAuthors = Array.from(new Set([
    ...$readBooks.flatMap(book => book.author_name || []),
    ...$recommendedBooks.flatMap(book => book.author_name || []),
    ...$wantToReadBooks.flatMap(book => book.author_name || [])
  ].filter(Boolean))).sort();

  $: authorStats = allAuthors.map(author => {
    const readCount = $readBooks.filter(book => 
      book.author_name?.some(name => name.toLowerCase() === author.toLowerCase())
    ).length;
    
    const recommendedCount = $recommendedBooks.filter(book => 
      book.author_name?.some(name => name.toLowerCase() === author.toLowerCase())
    ).length;
    
    const wantToReadCount = $wantToReadBooks.filter(book => 
      book.author_name?.some(name => name.toLowerCase() === author.toLowerCase())
    ).length;

    return {
      name: author,
      readCount,
      recommendedCount,
      wantToReadCount,
      totalCount: readCount + recommendedCount + wantToReadCount
    };
  }).sort((a, b) => b.totalCount - a.totalCount);

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
  <div class="authors-container">
    <h1 class="page-title">Mis Autores</h1>
    
    {#if allAuthors.length === 0}
      <div class="empty-state">
        <div class="empty-state-icon">✍️</div>
        <p class="empty-state-message">
          Aún no has agregado ningún libro a tus listas.
          ¡Comienza a explorar y descubre nuevos autores!
        </p>
      </div>
    {:else}
      <div class="authors-list">
        {#each authorStats as author}
          <div class="author-section">
            <div class="author-header">
              <h2 class="author-title">{author.name}</h2>
              <div class="author-stats">
                {#if author.readCount > 0}
                  <span class="stat-badge read">
                    {author.readCount} {author.readCount === 1 ? 'leído' : 'leídos'}
                  </span>
                {/if}
                {#if author.recommendedCount > 0}
                  <span class="stat-badge recommended">
                    {author.recommendedCount} {author.recommendedCount === 1 ? 'recomendado' : 'recomendados'}
                  </span>
                {/if}
                {#if author.wantToReadCount > 0}
                  <span class="stat-badge want-to-read">
                    {author.wantToReadCount} {author.wantToReadCount === 1 ? 'por leer' : 'por leer'}
                  </span>
                {/if}
              </div>
            </div>
            <AuthorBooks 
              authorName={author.name} 
              on:bookClick={handleBookClick}
            />
          </div>
        {/each}
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

  .authors-container {
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

  .authors-list {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .author-section {
    background: #f5f0e6;
    border-radius: 16px;
    padding: 2rem;
  }

  .author-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-title {
    font-size: 2rem;
    color: #5c4033;
    margin: 0;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
  }

  .author-stats {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .stat-badge {
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }

  .stat-badge.read {
    background: #5c4033;
    color: white;
  }

  .stat-badge.recommended {
    background: #8d4a2c;
    color: white;
  }

  .stat-badge.want-to-read {
    background: #c17a5c;
    color: white;
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

    .author-section {
      padding: 1.5rem;
    }

    .author-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .author-title {
      font-size: 1.75rem;
    }

    .author-stats {
      width: 100%;
    }

    .stat-badge {
      flex: 1;
      text-align: center;
    }
  }
</style> 