<script lang="ts">
  import { onMount } from 'svelte';
  import { readBooks } from '$lib/stores/bookLists';
  import RecomendationCard from '$lib/components/RecomendationCard.svelte';
  import BookModal from '$lib/components/BookModal.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import { get } from 'svelte/store';

  let recomendationsData: Array<{ likedBook: any, recommendations: any[] }> = [];
  let isLoading = true;
  let modalBook: any = null;
  let isModalOpen = false;

  async function fetchBookDetails(bookKey: string) {
    try {
      const res = await fetch(`https://openlibrary.org${bookKey}.json`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  }

  async function fetchSubjectBooks(subject: string) {
    try {
      const res = await fetch(`https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching subject books:', error);
      return { works: [] };
    }
  }

  function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function loadRecomendations() {
    try {
      isLoading = true;
      recomendationsData = [];
      const books = get(readBooks).filter((b: any) => b.rating >= 4);
      
      if (books.length === 0) {
        console.log('No books with rating >= 4 found');
        isLoading = false;
        return;
      }

      console.log('Loading recommendations for', books.length, 'books');
      
      for (const likedBook of books) {
        try {
          console.log('Fetching details for book:', likedBook.key);
          const details = await fetchBookDetails(likedBook.key);
          
          if (!details || !details.subjects || details.subjects.length === 0) {
            console.log('No subjects found for book:', likedBook.key);
            continue;
          }

          // Filter subjects to only include single words
          const singleWordSubjects = details.subjects.filter((subject: string) => !subject.includes(' '));
          
          if (singleWordSubjects.length === 0) {
            console.log('No single-word subjects found for book:', likedBook.key);
            continue;
          }

          const subject = getRandomElement(singleWordSubjects);
          console.log('Subjects:', singleWordSubjects);
          console.log('Subject:', subject);
          console.log('Fetching books for subject:', subject);
          
          const subjectData = await fetchSubjectBooks(subject.toLowerCase());
          let recs = subjectData.works?.filter((w: any) => w.key !== likedBook.key).slice(0, 3) || [];
          console.log('Recommendations:', recs);
          
          if (recs.length > 0) {
            recomendationsData.push({ likedBook, recommendations: recs });
          }
        } catch (error) {
          console.error('Error processing book:', likedBook.key, error);
          continue;
        }
      }
    } catch (error) {
      console.error('Error in loadRecomendations:', error);
    } finally {
      isLoading = false;
    }
  }

  function handleBookClick(event: CustomEvent) {
    modalBook = event.detail;
    isModalOpen = true;
  }

  function handleModalClose() {
    isModalOpen = false;
    modalBook = null;
  }

  onMount(loadRecomendations);
</script>

<Navbar />
<main class="recomendations-main">
  <h1>Recomendaciones para ti</h1>
  {#if isLoading}
    <div class="loading">Cargando recomendaciones...</div>
  {:else if recomendationsData.length === 0}
    <div class="no-recs">No hay recomendaciones disponibles. Agrega libros leídos con rating 4 o más.</div>
  {:else}
    {#each recomendationsData as { likedBook, recommendations } (likedBook.key)}
      <RecomendationCard {likedBook} {recommendations} on:bookClick={handleBookClick} />
    {/each}
  {/if}
  <BookModal isOpen={isModalOpen} book={modalBook} on:close={handleModalClose} />
</main>

<style>
  .recomendations-main {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 2rem 1rem;
    font-family: 'Poppins', sans-serif;
  }
  h1 {
    font-size: 2.2rem;
    color: #5c4033;
    margin-bottom: 2.5rem;
    text-align: center;
  }
  .loading, .no-recs {
    text-align: center;
    color: #5c4033;
    font-size: 1.2rem;
    margin-top: 3rem;
  }
</style> 