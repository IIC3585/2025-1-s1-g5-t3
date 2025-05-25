<script lang="ts">
  import { readBooks, recommendedBooks, wantToReadBooks } from '$lib/stores/bookLists';
  import BookCarousel from './BookCarousel.svelte';
  import { createEventDispatcher } from 'svelte';

  export let authorName: string;
  const dispatch = createEventDispatcher();

  $: authorBooks = {
    read: $readBooks.filter(book => 
      book.author_name?.some(author => author.toLowerCase() === authorName.toLowerCase())
    ),
    recommended: $recommendedBooks.filter(book => 
      book.author_name?.some(author => author.toLowerCase() === authorName.toLowerCase())
    ),
    wantToRead: $wantToReadBooks.filter(book => 
      book.author_name?.some(author => author.toLowerCase() === authorName.toLowerCase())
    )
  };

  function handleBookClick(event: CustomEvent) {
    dispatch('bookClick', event.detail);
  }
</script>

<div class="author-section">
  {#if authorBooks.read.length > 0}
    <BookCarousel 
      books={authorBooks.read} 
      title="Libros leídos"
      on:bookClick={handleBookClick}
    />
  {/if}

  {#if authorBooks.recommended.length > 0}
    <BookCarousel 
      books={authorBooks.recommended} 
      title="Libros recomendados"
      on:bookClick={handleBookClick}
    />
  {/if}

  {#if authorBooks.wantToRead.length > 0}
    <BookCarousel 
      books={authorBooks.wantToRead} 
      title="Libros por leer"
      on:bookClick={handleBookClick}
    />
  {/if}

  {#if authorBooks.read.length === 0 && authorBooks.recommended.length === 0 && authorBooks.wantToRead.length === 0}
    <p class="no-books">No hay libros de este autor en ninguna de tus listas.</p>
  {/if}
</div>

<style>
  .author-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .no-books {
    text-align: center;
    color: #5c4033;
    font-size: 1.1rem;
    margin: 2rem 0;
    font-family: 'Poppins', sans-serif;
  }
</style> 