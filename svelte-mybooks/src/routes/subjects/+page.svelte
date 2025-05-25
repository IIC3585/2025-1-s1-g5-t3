<script lang="ts">
  import { readBooks } from '$lib/stores/bookLists';
  import SubjectBooks from '$lib/components/SubjectBooks.svelte';
  import BookModal from '$lib/components/BookModal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { onMount } from 'svelte';

  let selectedBook: any = null;
  let isModalOpen = false;
  let isLoading = true;
  let topSubjects: string[] = [];
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

  function calculateTopSubjects(books: any[]) {
    const subjectCount: { [key: string]: number } = {};
    
    books.forEach(book => {
      const details = bookDetails[book.key];
      if (details?.subjects) {
        details.subjects.slice(0, 50).forEach((subject: string) => {
          const cleanSubject = subject.toLowerCase()
            .replace(/^fiction\s*/, '')
            .replace(/^novels\s*/, '')
            .replace(/^stories\s*/, '')
            .trim();
          
          if (cleanSubject) {
            subjectCount[cleanSubject] = (subjectCount[cleanSubject] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(subjectCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([subject]) => subject);
  }

  async function loadSubjects() {
    if ($readBooks.length > 0) {
      isLoading = true;
      await loadBookDetails($readBooks);
      topSubjects = calculateTopSubjects($readBooks);
      isLoading = false;
    } else {
      topSubjects = [];
      isLoading = false;
    }
  }

  $: if ($readBooks) {
    loadSubjects();
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

<Navbar />

<main>
  <div class="subjects-container">
    <h1 class="page-title">Mis Temas Favoritos</h1>
    
    {#if isLoading}
      <p class="loading">Cargando tus temas favoritos...</p>
    {:else if topSubjects.length === 0}
      <p class="no-subjects">
        Aún no has agregado ningún libro a tu lista de leídos.
        ¡Comienza a leer y tus temas favoritos aparecerán aquí!
      </p>
    {:else}
      <div class="subjects-list">
        {#each topSubjects as subject}
          <SubjectBooks 
            subject={subject} 
            on:bookClick={handleBookClick}
          />
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

  .subjects-container {
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

  .loading, .no-subjects {
    text-align: center;
    color: #5c4033;
    font-size: 1.2rem;
    margin: 3rem 0;
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
  }

  .loading {
    opacity: 0.7;
  }

  .subjects-list {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
  }
</style> 