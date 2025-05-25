<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let books: Array<{
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    key: string;
  }> = [];
  
  export let title: string = '';
  
  const dispatch = createEventDispatcher();
  
  let currentIndex = 0;
  const booksPerPage = 3;
  
  $: uniqueBooks = Array.from(new Map(books.map(book => [book.key, book])).values());
  $: totalPages = Math.ceil(uniqueBooks.length / booksPerPage);
  $: visibleBooks = uniqueBooks.slice(currentIndex * booksPerPage, (currentIndex + 1) * booksPerPage);
  
  function handleBookClick(book: typeof books[0]) {
    dispatch('bookClick', book);
  }
  
  function nextPage() {
    if (currentIndex < totalPages - 1) {
      currentIndex++;
    }
  }
  
  function prevPage() {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }

  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150x200?text=No+Image';
  }
</script>

<div class="carousel-container">
  {#if title}
    <h2 class="carousel-title">{title}</h2>
  {/if}
  
  <div class="carousel">
    <button 
      class="nav-button prev" 
      on:click={prevPage}
      disabled={currentIndex === 0}
      aria-label="Página anterior"
    >
      ←
    </button>
    
    <div class="books-container">
      {#each visibleBooks as book (book.key)}
        <button 
          type="button"
          class="book-card" 
          on:click={() => handleBookClick(book)}
          transition:fade
        >
          <div class="book-cover">
            {#if book.cover_i}
              <img 
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                alt={`Portada de ${book.title}`}
                on:error={handleImageError}
              />
            {:else}
              <div class="no-cover">Sin portada</div>
            {/if}
          </div>
          <div class="book-info">
            <h3 class="book-title">{book.title}</h3>
            {#if book.author_name}
              <p class="book-author">{book.author_name[0]}</p>
            {/if}
            {#if book.first_publish_year}
              <p class="book-year">{book.first_publish_year}</p>
            {/if}
          </div>
        </button>
      {/each}
    </div>
    
    <button 
      class="nav-button next" 
      on:click={nextPage}
      disabled={currentIndex >= totalPages - 1}
      aria-label="Página siguiente"
    >
      →
    </button>
  </div>
  
  {#if totalPages > 1}
    <div class="carousel-dots">
      {#each Array(totalPages) as _, i}
        <button 
          class="dot" 
          class:active={i === currentIndex}
          on:click={() => currentIndex = i}
          aria-label={`Ir a página ${i + 1}`}
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .carousel-container {
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    position: relative;
  }

  .carousel-title {
    font-size: 1.75rem;
    color: #5c4033;
    margin-bottom: 2rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.75rem;
  }

  .carousel-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #5c4033;
    border-radius: 2px;
  }

  .carousel {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    padding: 1rem 0;
  }

  .books-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    flex: 1;
    overflow: hidden;
    padding: 0.5rem;
  }

  .nav-button {
    background: #5c4033;
    color: white;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(92, 64, 51, 0.2);
    z-index: 2;
  }

  .nav-button:hover:not(:disabled) {
    background: #4a3329;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(92, 64, 51, 0.3);
  }

  .nav-button:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
  }

  .book-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(92, 64, 51, 0.1);
    cursor: pointer;
    padding: 0;
    text-align: left;
    width: 100%;
  }

  .book-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(92, 64, 51, 0.15);
    border-color: rgba(92, 64, 51, 0.2);
  }

  .book-cover {
    width: 100%;
    height: 320px;
    background: #f5f0e6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .book-cover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
    pointer-events: none;
  }

  .book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .book-card:hover .book-cover img {
    transform: scale(1.05);
  }

  .no-cover {
    color: #5c4033;
    font-size: 1rem;
    text-align: center;
    padding: 1.5rem;
    background: #f5f0e6;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .book-info {
    padding: 1.25rem;
    background: white;
  }

  .book-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #5c4033;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-author {
    font-size: 0.95rem;
    color: #5c4033;
    opacity: 0.85;
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }

  .book-year {
    font-size: 0.85rem;
    color: #5c4033;
    opacity: 0.7;
    margin: 0;
    font-weight: 500;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e0e0e0;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dot:hover {
    background: #c0c0c0;
  }

  .dot.active {
    background: #5c4033;
    transform: scale(1.2);
    box-shadow: 0 2px 4px rgba(92, 64, 51, 0.2);
  }

  @media (max-width: 1024px) {
    .books-container {
      gap: 2rem;
    }

    .book-cover {
      height: 280px;
    }
  }

  @media (max-width: 768px) {
    .carousel-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .books-container {
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
    }

    .book-cover {
      height: 240px;
    }

    .nav-button {
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }

    .book-info {
      padding: 1rem;
    }

    .book-title {
      font-size: 1rem;
    }
  }
</style> 