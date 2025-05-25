<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import BookCarousel from './BookCarousel.svelte';
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let subject: string;
  const dispatch = createEventDispatcher();

  let subjectBooks: any[] = [];
  let isLoading = true;

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

  async function loadSubjectBooks() {
    isLoading = true;
    const booksWithSubjects = await Promise.all(
      $readBooks.map(async (book) => {
        const details = await fetchBookDetails(book.key);
        if (details?.subjects) {
          const cleanSubjects = details.subjects
            .map((s: string) => s.toLowerCase()
              .replace(/^fiction\s*/, '')
              .replace(/^novels\s*/, '')
              .replace(/^stories\s*/, '')
              .trim()
            )
            .filter(Boolean);
          
          if (cleanSubjects.includes(subject.toLowerCase())) {
            return book;
          }
        }
        return null;
      })
    );

    subjectBooks = booksWithSubjects.filter(Boolean);
    isLoading = false;
  }

  $: if (subject) {
    loadSubjectBooks();
  }

  function handleBookClick(event: CustomEvent) {
    dispatch('bookClick', event.detail);
  }
</script>

<div class="subject-section">
  <h2 class="subject-title">{subject}</h2>
  {#if isLoading}
    <p class="loading">Cargando libros...</p>
  {:else if subjectBooks.length > 0}
    <BookCarousel 
      books={subjectBooks} 
      title={`Libros leídos de ${subject}`}
      on:bookClick={handleBookClick}
    />
  {:else}
    <p class="no-books">No has leído ningún libro de este tema aún.</p>
  {/if}
</div>

<style>
  .subject-section {
    margin: 2rem 0;
  }

  .subject-title {
    font-size: 2rem;
    color: #5c4033;
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    text-transform: capitalize;
  }

  .no-books, .loading {
    text-align: center;
    color: #5c4033;
    font-size: 1.1rem;
    margin: 2rem 0;
    font-family: 'Poppins', sans-serif;
  }

  .loading {
    opacity: 0.7;
  }
</style> 